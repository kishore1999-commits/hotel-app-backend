import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async findByBookingId(bookingId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { bookingId },
      include: {
        booking: {
          select: {
            id: true,
            userId: true,
            status: true,
            totalPrice: true,
            checkIn: true,
            checkOut: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found for this booking');
    }

    return transaction;
  }
}
