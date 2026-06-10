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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const dto_1 = require("../../common/dto");
let RoomsService = class RoomsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const where = {
            deletedAt: null,
            isActive: true,
        };
        if (query.hotelId)
            where.hotelId = query.hotelId;
        if (query.type)
            where.type = { contains: query.type, mode: 'insensitive' };
        if (query.status)
            where.status = query.status;
        if (query.minCapacity)
            where.capacity = { gte: query.minCapacity };
        if (query.minPrice || query.maxPrice) {
            where.pricePerNight = {};
            if (query.minPrice)
                where.pricePerNight.gte = query.minPrice;
            if (query.maxPrice)
                where.pricePerNight.lte = query.maxPrice;
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
            meta: (0, dto_1.buildPaginationMeta)(total, query.page, query.limit),
        };
    }
    async findByHotel(hotelId, query) {
        query.hotelId = hotelId;
        return this.findAll(query);
    }
    async findOne(id) {
        const room = await this.prisma.room.findFirst({
            where: { id, deletedAt: null },
            include: { hotel: true },
        });
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        return room;
    }
    async create(dto) {
        return this.prisma.room.create({
            data: dto,
            include: { hotel: { select: { id: true, name: true } } },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.room.update({
            where: { id },
            data: dto,
            include: { hotel: { select: { id: true, name: true } } },
        });
    }
    async softDelete(id) {
        await this.findOne(id);
        return this.prisma.room.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async checkAvailability(roomId, checkIn, checkOut) {
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
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map