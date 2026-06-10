"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BookingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const razorpay_service_1 = require("./razorpay.service");
const dto_1 = require("../../common/dto");
const CANCELLATION_HOURS_BEFORE_CHECKIN = 24;
let BookingsService = BookingsService_1 = class BookingsService {
    constructor(prisma, razorpayService) {
        this.prisma = prisma;
        this.razorpayService = razorpayService;
        this.logger = new common_1.Logger(BookingsService_1.name);
    }
    async create(userId, dto) {
        const checkIn = new Date(dto.checkIn);
        const checkOut = new Date(dto.checkOut);
        if (checkIn >= checkOut) {
            throw new common_1.BadRequestException('Check-out must be after check-in');
        }
        if (checkIn < new Date()) {
            throw new common_1.BadRequestException('Check-in date must be in the future');
        }
        const hotel = await this.prisma.hotel.findFirst({
            where: { id: dto.hotelId, deletedAt: null, isActive: true },
        });
        if (!hotel) {
            throw new common_1.NotFoundException('Hotel not found or inactive');
        }
        const booking = await this.prisma.$transaction(async (tx) => {
            const rooms = await tx.$queryRawUnsafe(`SELECT id, "pricePerNight", status, "isActive", "deletedAt"
         FROM rooms
         WHERE id = $1
         FOR UPDATE`, dto.roomId);
            if (!rooms.length || rooms[0].deletedAt || !rooms[0].isActive) {
                throw new common_1.NotFoundException('Room not found or inactive');
            }
            if (rooms[0].status !== 'AVAILABLE') {
                throw new common_1.ConflictException('Room is not currently available');
            }
            const conflicts = await tx.$queryRawUnsafe(`SELECT id FROM bookings
         WHERE "roomId" = $1
           AND "deletedAt" IS NULL
           AND status IN ('PENDING', 'CONFIRMED')
           AND "checkIn" < $2
           AND "checkOut" > $3
         FOR UPDATE`, dto.roomId, checkOut, checkIn);
            if (conflicts.length > 0) {
                throw new common_1.ConflictException('Room is already booked for the selected dates');
            }
            return tx.booking.create({
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
        }, {
            isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable,
        });
        const razorpayOrder = await this.razorpayService.createOrder(dto.totalPrice, booking.id);
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
    async verifyPayment(dto) {
        const isValid = this.razorpayService.verifySignature(dto.razorpayOrderId, dto.razorpayPaymentId, dto.razorpaySignature);
        if (!isValid) {
            throw new common_1.BadRequestException('Invalid payment signature');
        }
        const transaction = await this.prisma.transaction.findUnique({
            where: { razorpayOrderId: dto.razorpayOrderId },
        });
        if (!transaction) {
            throw new common_1.NotFoundException('Transaction not found');
        }
        await this.prisma.$transaction([
            this.prisma.transaction.update({
                where: { id: transaction.id },
                data: {
                    razorpayPaymentId: dto.razorpayPaymentId,
                    status: 'CAPTURED',
                    responseData: {
                        razorpayOrderId: dto.razorpayOrderId,
                        razorpayPaymentId: dto.razorpayPaymentId,
                    },
                },
            }),
            this.prisma.booking.update({
                where: { id: transaction.bookingId },
                data: { status: 'CONFIRMED', paymentStatus: 'PAID' },
            }),
        ]);
        return { message: 'Payment verified and booking confirmed' };
    }
    async findMyBookings(userId, pagination) {
        const where = { userId, deletedAt: null };
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
            meta: (0, dto_1.buildPaginationMeta)(total, pagination.page, pagination.limit),
        };
    }
    async findAll(pagination) {
        const where = { deletedAt: null };
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
            meta: (0, dto_1.buildPaginationMeta)(total, pagination.page, pagination.limit),
        };
    }
    async cancel(bookingId, userId, dto, isAdmin) {
        const booking = await this.prisma.booking.findFirst({
            where: { id: bookingId, deletedAt: null },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (!isAdmin && booking.userId !== userId) {
            throw new common_1.BadRequestException('You can only cancel your own bookings');
        }
        if (booking.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Booking is already cancelled');
        }
        if (booking.status === 'COMPLETED') {
            throw new common_1.BadRequestException('Cannot cancel a completed booking');
        }
        if (!isAdmin) {
            const hoursUntilCheckIn = (booking.checkIn.getTime() - Date.now()) / (1000 * 60 * 60);
            if (hoursUntilCheckIn < CANCELLATION_HOURS_BEFORE_CHECKIN) {
                throw new common_1.BadRequestException(`Cancellation must be at least ${CANCELLATION_HOURS_BEFORE_CHECKIN} hours before check-in`);
            }
        }
        const updated = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: 'CANCELLED',
                cancellationReason: dto.cancellationReason,
            },
            include: {
                hotel: { select: { id: true, name: true } },
                room: { select: { id: true, name: true } },
            },
        });
        this.logger.log(`Booking ${bookingId} cancelled by user ${userId}`);
        return updated;
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = BookingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        razorpay_service_1.RazorpayService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map