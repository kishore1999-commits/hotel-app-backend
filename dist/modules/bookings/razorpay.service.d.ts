interface RazorpayOrder {
    id: string;
    amount: number;
    currency: string;
    status: string;
}
export declare class RazorpayService {
    private readonly logger;
    private razorpay;
    constructor();
    createOrder(amount: number, bookingId: string): Promise<RazorpayOrder>;
    verifySignature(orderId: string, paymentId: string, signature: string): boolean;
}
export {};
