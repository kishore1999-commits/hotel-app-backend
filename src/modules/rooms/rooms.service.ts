import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoomDto, UpdateRoomDto, QueryRoomDto } from './dto';
import { buildPaginationMeta } from '../../common/dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryRoomDto) {
    const where: Prisma.RoomWhereInput = {
      deletedAt: null,
      isActive: true,
    };

    if (query.hotelId) where.hotelId = query.hotelId;
    if (query.type) where.type = { contains: query.type, mode: 'insensitive' };
    if (query.status) where.status = query.status;
    if (query.minCapacity) where.capacity = { gte: query.minCapacity };

    if (query.minPrice || query.maxPrice) {
      where.pricePerNight = {};
      if (query.minPrice) (where.pricePerNight as any).gte = query.minPrice;
      if (query.maxPrice) (where.pricePerNight as any).lte = query.maxPrice;
    }

    const [rooms, total] = await Promise.all([
      this.prisma.room.findMany({
        where,
        skip: query.skip,
        take: query.limit,
        orderBy: { pricePerNight: 'asc' },
        include: { hotel: { select: { id: true, name: true, city: true } } },
      }),
      this.prisma.room.count({ where }),
    ]);

    return {
      data: rooms,
      meta: buildPaginationMeta(total, query.page!, query.limit!),
    };
  }

  async findByHotel(hotelId: string, query: QueryRoomDto) {
    query.hotelId = hotelId;
    return this.findAll(query);
  }

  async findOne(id: string) {
    const room = await this.prisma.room.findFirst({
      where: { id, deletedAt: null },
      include: { hotel: true },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  async create(dto: CreateRoomDto) {
    return this.prisma.room.create({
      data: dto,
      include: { hotel: { select: { id: true, name: true } } },
    });
  }

  async update(id: string, dto: UpdateRoomDto) {
    await this.findOne(id);
    return this.prisma.room.update({
      where: { id },
      data: dto,
      include: { hotel: { select: { id: true, name: true } } },
    });
  }

  async softDelete(id: string) {
    await this.findOne(id);
    return this.prisma.room.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async checkAvailability(roomId: string, checkIn: Date, checkOut: Date): Promise<boolean> {
    const conflicting = await this.prisma.booking.count({
      where: {
        roomId,
        deletedAt: null,
        status: { in: ['PENDING', 'CONFIRMED'] },
        checkIn: { lt: checkOut },
        checkOut: { gt: checkIn },
      },
    });

    return conflicting === 0;
  }
}
