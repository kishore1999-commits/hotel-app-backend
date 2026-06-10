import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { RazorpayService } from './razorpay.service';
import { CreateBookingDto, VerifyPaymentDto, CancelBookingDto } from './dto';
import { buildPaginationMeta, PaginationDto } from '../../common/dto';

const CANCELLATION_HOURS_BEFORE_CHECKIN = 24;

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    private prisma: PrismaService,
    private razorpayService: RazorpayService,
  ) {}

  async create(userId: string, dto: CreateBookingDto) {
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);

    if (checkIn >= checkOut) {
      throw new BadRequestException('Check-out must be after check-in');
    }

    if (checkIn < new Date()) {
      throw new BadRequestException('Check-in date must be in the future');
    }

    const booking = await this.prisma.$transaction(async (tx) => {
      const room = await tx.$queryRaw<any[]>`
        SELECT id, "pricePerNight", status, "isActive", "deletedAt"
        FROM rooms
        WHERE id = ${dto.roomId}
        FOR UPDATE
      `;

      if (!room.length || room[0].deletedAt || !room[0].isActive) {
        throw new NotFoundException('Room not found or inactive');
      }

      if (room[0].status !== 'AVAILABLE') {
        throw new ConflictException('Room is not available');
      }

      const conflicting = await tx.$queryRaw<any[]>`
        SELECT id FROM bookings
        WHERE "roomId" = ${dto.roomId}
          AND "deletedAt" IS NULL
          AND status IN ('PENDING', 'CONFIRMED')
          AND "checkIn" < ${checkOut}
          AND "checkOut" > ${checkIn}
        FOR UPDATE
      `;

      if (conflicting.length > 0) {
        throw new ConflictException('Room is already booked for the selected dates');
      }

      const newBooking = await tx.booking.create({
        data: {
          userId,
          hotelId: dto.hotelId,
          roomId: dto.roomId,
          checkIn,
          checkOut,
          totalPrice: dto.totalPrice,
          specialRequests: dto.specialRequests,
        },
        include: {
          hotel: { select: { id: true, name: true } },
          room: { select: { id: true, name: true, type: true } },
        },
      });

      return newBooking;
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });

    const razorpayOrder = await this.razorpayService.createOrder(
      dto.totalPrice,
      booking.id,
    );

    await this.prisma.transaction.create({
      data: {
        bookingId: booking.id,
        razorpayOrderId: razorpayOrder.id,
        amount: dto.totalPrice,
        status: 'CREATED',
      },
    });

    return {
      booking,
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    };
  }

  async verifyPayment(dto: VerifyPaymentDto) {
    const isValid = this.razorpayService.verifySignature(
      dto.razorpayOrderId,
      dto.razorpayPaymentId,
      dto.razorpaySignature,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid payment signature');
    }

    const transaction = await this.prisma.transaction.findUnique({
      where: { razorpayOrderId: dto.razorpayOrderId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    await this.prisma.$transaction([
      this.prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          razorpayPaymentId: dto.razorpayPaymentId,
          status: 'CAPTURED',
          responseData: { razorpayPaymentId: dto.razorpayPaymentId },
        },
      }),
      this.prisma.booking.update({
        where: { id: transaction.bookingId },
        data: { status: 'CONFIRMED', paymentStatus: 'PAID' },
      }),
    ]);

    return { message: 'Payment verified and booking confirmed' };
  }

  async findMyBookings(userId: string, pagination: PaginationDto) {
    const where: Prisma.BookingWhereInput = { userId, deletedAt: null };

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          hotel: { select: { id: true, name: true, city: true } },
          room: { select: { id: true, name: true, type: true } },
          transaction: { select: { razorpayOrderId: true, status: true } },
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings,
      meta: buildPaginationMeta(total, pagination.page!, pagination.limit!),
    };
  }

  async findAll(pagination: PaginationDto) {
    const where: Prisma.BookingWhereInput = { deletedAt: null };

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          hotel: { select: { id: true, name: true } },
          room: { select: { id: true, name: true, type: true } },
          transaction: { select: { razorpayOrderId: true, status: true, amount: true } },
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings,
      meta: buildPaginationMeta(total, pagination.page!, pagination.limit!),
    };
  }

  async cancel(bookingId: string, userId: string, dto: CancelBookingDto, isAdmin: boolean) {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, deletedAt: null },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (!isAdmin && booking.userId !== userId) {
      throw new BadRequestException('You can only cancel your own bookings');
    }

    if (booking.status === 'CANCELLED') {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.status === 'COMPLETED') {
      throw new BadRequestException('Cannot cancel a completed booking');
    }

    if (!isAdmin) {
      const hoursUntilCheckIn =
        (booking.checkIn.getTime() - Date.now()) / (1000 * 60 * 60);

      if (hoursUntilCheckIn < CANCELLATION_HOURS_BEFORE_CHECKIN) {
        throw new BadRequestException(
          `Cancellation must be at least ${CANCELLATION_HOURS_BEFORE_CHECKIN} hours before check-in`,
        );
      }
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
        cancellationReason: dto.cancellationReason,
      },
    });

    this.logger.log(`Booking ${bookingId} cancelled by user ${userId}`);
    return updated;
  }
}
