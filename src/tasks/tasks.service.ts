import { Injectable, NotFoundException } from '@nestjs/common';

import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  getAll(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getAll(filterDto, user);
  }
  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    return this.tasksRepository.createTask(title, description, user);
  }

  async getById(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id, user });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async deleteById(id: string, user: User): Promise<void> {
    await this.getById(id, user);

    this.tasksRepository.delete(id);
  }

  async updateStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getById(id, user);
    task.status = status;

    return this.tasksRepository.save(task);
  }
}
