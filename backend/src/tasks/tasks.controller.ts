import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getTasks(@Request() req) {
    return this.tasksService.findAll(req.user.sub);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createTask(@Body() dto: CreateTaskDto, @Request() req) {
    return this.tasksService.create(dto, req.user.sub);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateTask(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @Request() req,
  ) {
    return this.tasksService.update(id, dto, req.user.sub);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string, @Request() req) {
    return this.tasksService.remove(id, req.user.sub);
  }
}
