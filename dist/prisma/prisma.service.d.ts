import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService implements OnModuleInit, OnModuleDestroy {
    private readonly logger;
    private readonly client;
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    get user(): any;
    get hotel(): any;
    get room(): any;
    get booking(): any;
    get transaction(): any;
    get review(): any;
    $queryRaw: PrismaClient['$queryRaw'];
    $queryRawUnsafe: PrismaClient['$queryRawUnsafe'];
    $executeRaw: PrismaClient['$executeRaw'];
    $transaction: PrismaClient['$transaction'];
}
