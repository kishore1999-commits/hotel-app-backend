import { PrismaService } from '../../prisma/prisma.service';
import { RazorpayService } from './razorpay.service';
import { CreateBookingDto, VerifyPaymentDto, CancelBookingDto } from './dto';
import { PaginationDto } from '../../common/dto';
export declare class BookingsService {
    private prisma;
    private razorpayService;
    private readonly logger;
    constructor(prisma: PrismaService, razorpayService: RazorpayService);
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
    cancel(bookingId: string, userId: string, dto: CancelBookingDto, isAdmin: boolean): Promise<any>;
}
