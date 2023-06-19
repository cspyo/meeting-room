import { Injectable, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Injectable()
export class UsersService {
  private users: Array<User>;
  constructor() {
    this.users = [];
  }

  getAll() {
    return this.users;
  }

  createUser(dto: CreateUserDto): User {
    const { name, depart } = dto;
    const id = nanoid(6);
    const newUser = {
      id,
      name,
      depart,
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(uid: string, dto: UpdateUserDto) {
    const { name, depart } = dto;
    const user = this.findUserById(uid);
    user.name = name ?? user.name;
    user.depart = depart ?? user.depart;
    return user;
  }

  deleteUser(uid: string) {
    const user = this.findUserById(uid);
    this.users = this.users.filter((user) => user.id !== uid);
    return user;
  }

  findUserById(uid: string) {
    const user = this.users.find((user) => user.id === uid);
    if (!user) {
      throw new NotFoundException(`User ${uid} not found`);
    }
    return user;
  }
}
