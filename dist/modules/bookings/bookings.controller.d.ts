import { Role } from '@prisma/client';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, VerifyPaymentDto, CancelBookingDto } from './dto';
import { PaginationDto } from '../../common/dto';
export declare class BookingsController {
    private bookingsService;
    constructor(bookingsService: BookingsService);
    create(userId: string, dto: CreateBookingDto): Promise<{
        booking: {
            hotel: {
                name: string;
                id: string;
            };
            room: {
                name: string;
                type: string;
                id: string;
            };
        } & {
            id: string;
            hotelId: string;
            status: import(".prisma/client").$Enums.BookingStatus;
            roomId: string;
            checkIn: Date;
            checkOut: Date;
            totalPrice: number;
            specialRequests: string | null;
            cancellationReason: string | null;
            userId: string;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
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
