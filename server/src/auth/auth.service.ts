import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities';
import { ExtendedRepository } from '../core/extended-repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: ExtendedRepository<User>,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersRepository.findOneOrThrow(
      { username, enabled: true },
      new NotFoundException('User not found!'),
    );
    if (user.checkPassword(password)) {
      delete user.password;
      return user;
    }
    return null;
  }
}
