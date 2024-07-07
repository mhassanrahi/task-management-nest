import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getAll(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    return query.getMany();
  }

  createTask(title: string, description: string, user: User): Promise<Task> {
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    return this.save(task);
  }
}
