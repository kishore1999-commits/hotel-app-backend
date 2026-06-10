import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto';
import { buildPaginationMeta, PaginationDto } from '../../common/dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
    const hasBooking = await this.prisma.booking.findFirst({
      where: {
        userId,
        hotelId: dto.hotelId,
        status: 'COMPLETED',
        deletedAt: null,
      },
    });

    if (!hasBooking) {
      throw new BadRequestException(
        'You can only review hotels where you have completed a stay',
      );
    }

    const existing = await this.prisma.review.findUnique({
      where: { userId_hotelId: { userId, hotelId: dto.hotelId } },
    });

    if (existing) {
      throw new ConflictException('You have already reviewed this hotel');
    }

    return this.prisma.review.create({
      data: { userId, ...dto },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });
  }

  async findByHotel(hotelId: string, pagination: PaginationDto) {
    const where = { hotelId };

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, avatar: true } } },
      }),
      this.prisma.review.count({ where }),
    ]);

    const avgRating = await this.prisma.review.aggregate({
      where,
      _avg: { rating: true },
    });

    return {
      data: reviews,
      meta: {
        ...buildPaginationMeta(total, pagination.page!, pagination.limit!),
        averageRating: avgRating._avg.rating || 0,
      },
    };
  }
}
