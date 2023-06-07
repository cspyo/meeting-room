import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Get(':uid')
  async searchUser(@Param('uid') uid: string) {
    return this.usersService.findUserById(uid);
  }

  @Put(':uid')
  async updateUser(@Param('uid') uid: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(uid, dto);
  }

  @Delete(':uid')
  async deleteUser(@Param('uid') uid: string) {
    return this.usersService.deleteUser(uid);
  }
}
