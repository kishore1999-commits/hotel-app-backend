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
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
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
        data: ({
            hotel: {
                name: string;
                id: string;
                city: string;
            };
            room: {
                name: string;
                type: string;
                id: string;
            };
            transaction: {
                status: import(".prisma/client").$Enums.TransactionStatus;
                razorpayOrderId: string | null;
            } | null;
        } & {
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
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
        })[];
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
        data: ({
            user: {
                name: string;
                email: string;
                id: string;
            };
            hotel: {
                name: string;
                id: string;
            };
            room: {
                name: string;
                type: string;
                id: string;
            };
            transaction: {
                status: import(".prisma/client").$Enums.TransactionStatus;
                razorpayOrderId: string | null;
                amount: number;
            } | null;
        } & {
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    cancel(bookingId: string, userId: string, dto: CancelBookingDto, isAdmin: boolean): Promise<{
        hotel: {
            name: string;
            id: string;
        };
        room: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
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
    }>;
}
