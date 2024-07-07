import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}
}
