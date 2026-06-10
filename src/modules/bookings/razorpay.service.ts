import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
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
  private razorpay: any = null;

  private getInstance() {
    if (!this.razorpay) {
      try {
        const Razorpay = require('razorpay');
        this.razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
      } catch (err) {
        this.logger.error('Failed to initialize Razorpay', err);
        throw new InternalServerErrorException('Payment service unavailable');
      }
    }
    return this.razorpay;
  }

  async createOrder(amount: number, bookingId: string): Promise<RazorpayOrder> {
    const instance = this.getInstance();

    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: bookingId,
      notes: { bookingId },
    };

    try {
      const order = await instance.orders.create(options);
      this.logger.log(`Razorpay order created: ${order.id}`);
      return order;
    } catch (err) {
      this.logger.error('Failed to create Razorpay order', err);
      throw new InternalServerErrorException('Failed to create payment order');
    }
  }

  verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      this.logger.error('RAZORPAY_KEY_SECRET not configured');
      return false;
    }

    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    return expectedSignature === signature;
  }
}
