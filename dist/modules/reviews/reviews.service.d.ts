import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto';
import { PaginationDto } from '../../common/dto';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateReviewDto): Promise<any>;
    findByHotel(hotelId: string, pagination: PaginationDto): Promise<{
        data: any;
        meta: {
            averageRating: any;
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
}
