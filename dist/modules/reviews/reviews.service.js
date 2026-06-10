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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const dto_1 = require("../../common/dto");
let ReviewsService = class ReviewsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const hasBooking = await this.prisma.booking.findFirst({
            where: {
                userId,
                hotelId: dto.hotelId,
                status: 'COMPLETED',
                deletedAt: null,
            },
        });
        if (!hasBooking) {
            throw new common_1.BadRequestException('You can only review hotels where you have completed a stay');
        }
        const existing = await this.prisma.review.findUnique({
            where: { userId_hotelId: { userId, hotelId: dto.hotelId } },
        });
        if (existing) {
            throw new common_1.ConflictException('You have already reviewed this hotel');
        }
        return this.prisma.review.create({
            data: { userId, ...dto },
            include: { user: { select: { id: true, name: true, avatar: true } } },
        });
    }
    async findByHotel(hotelId, pagination) {
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
                ...(0, dto_1.buildPaginationMeta)(total, pagination.page, pagination.limit),
                averageRating: avgRating._avg.rating || 0,
            },
        };
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map