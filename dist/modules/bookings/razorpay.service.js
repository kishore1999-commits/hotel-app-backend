"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RazorpayService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorpayService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
let RazorpayService = RazorpayService_1 = class RazorpayService {
    constructor() {
        this.logger = new common_1.Logger(RazorpayService_1.name);
        this.razorpay = null;
    }
    getInstance() {
        if (!this.razorpay) {
            try {
                const Razorpay = require('razorpay');
                this.razorpay = new Razorpay({
                    key_id: process.env.RAZORPAY_KEY_ID,
                    key_secret: process.env.RAZORPAY_KEY_SECRET,
                });
            }
            catch (err) {
                this.logger.error('Failed to initialize Razorpay', err);
                throw new common_1.InternalServerErrorException('Payment service unavailable');
            }
        }
        return this.razorpay;
    }
    async createOrder(amount, bookingId) {
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
        }
        catch (err) {
            this.logger.error('Failed to create Razorpay order', err);
            throw new common_1.InternalServerErrorException('Failed to create payment order');
        }
    }
    verifySignature(orderId, paymentId, signature) {
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
};
exports.RazorpayService = RazorpayService;
exports.RazorpayService = RazorpayService = RazorpayService_1 = __decorate([
    (0, common_1.Injectable)()
], RazorpayService);
//# sourceMappingURL=razorpay.service.js.map