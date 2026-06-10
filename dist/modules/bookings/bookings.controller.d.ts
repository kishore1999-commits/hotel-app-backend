import { Role } from '@prisma/client';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, VerifyPaymentDto, CancelBookingDto } from './dto';
import { PaginationDto } from '../../common/dto';
export declare class BookingsController {
    private bookingsService;
    constructor(bookingsService: BookingsService);
    create(userId: string, dto: CreateBookingDto): Promise<{
        booking: any;
        razorpayOrder: {
            id: string;
            amount: number;
            currency: string;
        };
    }>;
    verifyPayment(dto: VerifyPaymentDto): Promise<{
        message: string;
    }>;
    findMyBookings(userId: string, pagination: PaginationDto): Promise<{
        data: any;
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    findAll(pagination: PaginationDto): Promise<{
        data: any;
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    cancel(id: string, userId: string, role: Role, dto: CancelBookingDto): Promise<any>;
}
