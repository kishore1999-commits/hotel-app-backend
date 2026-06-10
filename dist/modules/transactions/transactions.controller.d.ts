import { TransactionsService } from './transactions.service';
export declare class TransactionsController {
    private transactionsService;
    constructor(transactionsService: TransactionsService);
    findByBookingId(bookingId: string): Promise<any>;
}
