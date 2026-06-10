import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHotelDto, UpdateHotelDto, QueryHotelDto } from './dto';
import { buildPaginationMeta } from '../../common/dto';

@Injectable()
export class HotelsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryHotelDto) {
    const where: Prisma.HotelWhereInput = {
      deletedAt: null,
      isActive: true,
    };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { address: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.city) {
      where.city = { contains: query.city, mode: 'insensitive' };
    }

    if (query.country) {
      where.country = { contains: query.country, mode: 'insensitive' };
    }

    if (query.minRating) {
      where.starRating = { gte: query.minRating };
    }

    if (query.amenity) {
      where.amenities = { has: query.amenity };
    }

    const [hotels, total] = await Promise.all([
      this.prisma.hotel.findMany({
        where,
        skip: query.skip,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { rooms: true, reviews: true } },
        },
      }),
      this.prisma.hotel.count({ where }),
    ]);

    return {
      data: hotels,
      meta: buildPaginationMeta(total, query.page!, query.limit!),
    };
  }

  async findOne(id: string) {
    const hotel = await this.prisma.hotel.findFirst({
      where: { id, deletedAt: null },
      include: {
        rooms: { where: { deletedAt: null, isActive: true } },
        _count: { select: { reviews: true, bookings: true } },
      },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    return hotel;
  }

  async create(dto: CreateHotelDto) {
    return this.prisma.hotel.create({ data: dto });
  }

  async update(id: string, dto: UpdateHotelDto) {
    await this.findOne(id);
    return this.prisma.hotel.update({ where: { id }, data: dto });
  }

  async softDelete(id: string) {
    await this.findOne(id);
    return this.prisma.hotel.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
