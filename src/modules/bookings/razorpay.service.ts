import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

@Injectable()
export class RazorpayService {
  private readonly logger = new Logger(RazorpayService.name);
  private razorpay: any;

  constructor() {
    const Razorpay = require('razorpay');
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(amount: number, bookingId: string): Promise<RazorpayOrder> {
    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: bookingId,
      notes: { bookingId },
    };

    const order = await this.razorpay.orders.create(options);
    this.logger.log(`Razorpay order created: ${order.id}`);
    return order;
  }

  verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    return expectedSignature === signature;
  }
}
