import { PrismaService } from '../../prisma/prisma.service';
export declare class TransactionsService {
    private prisma;
    constructor(prisma: PrismaService);
    findByBookingId(bookingId: string): Promise<any>;
}
