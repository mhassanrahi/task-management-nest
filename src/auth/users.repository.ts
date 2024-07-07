import { DataSource, Repository } from 'typeorm';

import { User } from './user.entity';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    try {
      const { username, password } = authCredentialsDto;

      const user = this.create({
        username,
        password,
      });

      await this.save(user);
    } catch (error) {
      console.log(error);
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getByUserName(username: string): Promise<User> {
    return this.findOne({
      where: { username },
    });
  }
}
