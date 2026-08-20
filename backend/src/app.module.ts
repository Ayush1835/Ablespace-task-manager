import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [AuthModule, TasksModule],
  providers: [PrismaService],
})
export class AppModule {}
