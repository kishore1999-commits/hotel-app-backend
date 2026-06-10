import { TransactionsService } from './transactions.service';
export declare class TransactionsController {
    private transactionsService;
    constructor(transactionsService: TransactionsService);
    findByBookingId(bookingId: string): Promise<{
        booking: {
            id: string;
            status: import(".prisma/client").$Enums.BookingStatus;
            checkIn: Date;
            checkOut: Date;
            totalPrice: number;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TransactionStatus;
        razorpayOrderId: string | null;
        razorpayPaymentId: string | null;
        amount: number;
        responseData: import("@prisma/client/runtime/library").JsonValue | null;
        bookingId: string;
    }>;
}
