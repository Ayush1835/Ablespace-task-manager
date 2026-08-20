import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.task.findMany({
      where: { assigneeId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, assigneeId: userId },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async create(dto: CreateTaskDto, userId: string) {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status || 'TODO',
        priority: dto.priority || 'MEDIUM',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        progress: dto.progress !== undefined ? dto.progress : 0,
        assigneeId: userId,
      },
    });
  }

  async update(id: string, dto: UpdateTaskDto, userId: string) {
    // Ensure task belongs to user
    await this.findOne(id, userId);

    return this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        progress: dto.progress !== undefined ? dto.progress : undefined,
      },
    });
  }

  async remove(id: string, userId: string) {
    // Ensure task belongs to user
    await this.findOne(id, userId);

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
