import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto';
import { PaginationDto } from '../../common/dto';
export declare class ReviewsController {
    private reviewsService;
    constructor(reviewsService: ReviewsService);
    create(userId: string, dto: CreateReviewDto): Promise<{
        user: {
            name: string;
            id: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        hotelId: string;
        userId: string;
        rating: number;
        comment: string | null;
    }>;
    findByHotel(hotelId: string, pagination: PaginationDto): Promise<{
        data: ({
            user: {
                name: string;
                id: string;
                avatar: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            hotelId: string;
            userId: string;
            rating: number;
            comment: string | null;
        })[];
        meta: {
            averageRating: number;
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
}
