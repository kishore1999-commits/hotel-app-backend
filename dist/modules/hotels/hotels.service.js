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
exports.HotelsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const dto_1 = require("../../common/dto");
let HotelsService = class HotelsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const where = {
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
            meta: (0, dto_1.buildPaginationMeta)(total, query.page, query.limit),
        };
    }
    async findOne(id) {
        const hotel = await this.prisma.hotel.findFirst({
            where: { id, deletedAt: null },
            include: {
                rooms: { where: { deletedAt: null, isActive: true } },
                _count: { select: { reviews: true, bookings: true } },
            },
        });
        if (!hotel) {
            throw new common_1.NotFoundException('Hotel not found');
        }
        return hotel;
    }
    async create(dto) {
        return this.prisma.hotel.create({ data: dto });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.hotel.update({ where: { id }, data: dto });
    }
    async softDelete(id) {
        await this.findOne(id);
        return this.prisma.hotel.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.HotelsService = HotelsService;
exports.HotelsService = HotelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HotelsService);
//# sourceMappingURL=hotels.service.js.map