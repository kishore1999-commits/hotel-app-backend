import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

function buildClient() {
  return new PrismaClient().$extends(withAccelerate());
}

type AcceleratedClient = ReturnType<typeof buildClient>;

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly client: AcceleratedClient;

  constructor() {
    this.client = buildClient();
  }

  async onModuleInit() {
    await (this.client as any).$connect();
    this.logger.log('Database connected');
  }

  async onModuleDestroy() {
    await (this.client as any).$disconnect();
    this.logger.log('Database disconnected');
  }

  // --- Model accessors ---
  get user() { return this.client.user; }
  get hotel() { return this.client.hotel; }
  get room() { return this.client.room; }
  get booking() { return this.client.booking; }
  get transaction() { return this.client.transaction; }
  get review() { return this.client.review; }

  // --- Raw query helpers ---
  $queryRaw: PrismaClient['$queryRaw'] = (...args: any[]) =>
    (this.client as any).$queryRaw(...args);

  $queryRawUnsafe: PrismaClient['$queryRawUnsafe'] = (...args: any[]) =>
    (this.client as any).$queryRawUnsafe(...args);

  $executeRaw: PrismaClient['$executeRaw'] = (...args: any[]) =>
    (this.client as any).$executeRaw(...args);

  $transaction: PrismaClient['$transaction'] = (...args: any[]) =>
    (this.client as any).$transaction(...args);
}
