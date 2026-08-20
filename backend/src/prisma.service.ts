import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    // Only connect to database locally, bypass on Vercel serverless environment
    if (!process.env.VERCEL) {
      await this.$connect();
    }
  }

  async onModuleDestroy() {
    if (!process.env.VERCEL) {
      await this.$disconnect();
    }
  }
}
