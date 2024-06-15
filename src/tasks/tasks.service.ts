import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Task, TaskStatus } from './tasks.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      status: TaskStatus.OPEN,
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      status: TaskStatus.IN_PROGRESS,
    },
    {
      id: '3',
      title: 'Task 3',
      description: 'Description 3',
      status: TaskStatus.DONE,
    },
  ];

  getAll(): Task[] {
    return this.tasks;
  }

  create(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  getById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);
    
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    
    return task;
  }

  deleteById(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  updateStatus(id: string, status: TaskStatus): Task {
    const task = this.getById(id);
    task.status = status;
    return task;
  }

  getByFilter(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAll();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  }
}
