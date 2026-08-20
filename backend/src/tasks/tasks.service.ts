import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';
import { tasksStore, Task } from '../memory-store';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    if (process.env.VERCEL) {
      return Array.from(tasksStore.values())
        .filter((t) => t.assigneeId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return this.prisma.task.findMany({
      where: { assigneeId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    if (process.env.VERCEL) {
      const task = tasksStore.get(id);
      if (!task || task.assigneeId !== userId) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      return task;
    }

    const task = await this.prisma.task.findFirst({
      where: { id, assigneeId: userId },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async create(dto: CreateTaskDto, userId: string) {
    if (process.env.VERCEL) {
      const task: Task = {
        id: `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: dto.title,
        description: dto.description,
        status: dto.status || 'TODO',
        priority: dto.priority || 'MEDIUM',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        progress: dto.progress !== undefined ? dto.progress : 0,
        assigneeId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      tasksStore.set(task.id, task);
      return task;
    }

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
    if (process.env.VERCEL) {
      const task = await this.findOne(id, userId);
      const updatedTask: Task = {
        ...task,
        title: dto.title !== undefined ? dto.title : task.title,
        description: dto.description !== undefined ? dto.description : task.description,
        status: dto.status !== undefined ? dto.status : task.status,
        priority: dto.priority !== undefined ? dto.priority : task.priority,
        dueDate: dto.dueDate !== undefined ? (dto.dueDate ? new Date(dto.dueDate) : undefined) : task.dueDate,
        progress: dto.progress !== undefined ? dto.progress : task.progress,
        updatedAt: new Date(),
      };
      tasksStore.set(id, updatedTask);
      return updatedTask;
    }

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
    if (process.env.VERCEL) {
      const task = await this.findOne(id, userId);
      tasksStore.delete(id);
      return task;
    }

    // Ensure task belongs to user
    await this.findOne(id, userId);

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
