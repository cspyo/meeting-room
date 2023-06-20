import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UserResponse } from '../responses/user.response';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({
    status: 400,
    description: 'Data Type Validation Failed',
  })
  @ApiCreatedResponse({ description: 'Success', type: UserResponse })
  @ApiOperation({ summary: '회원가입' })
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const newUser = this.usersService.createUser(dto);
    return { code: 201, message: 'Sign up Success', data: { user: newUser } };
  }

  @ApiOkResponse({
    description: 'Success',
    type: UserResponse,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiOperation({ summary: 'ID 로 유저 정보 가져오기' })
  @Get(':uid')
  async searchUser(@Param('uid') uid: string) {
    const newUser = this.usersService.findUserById(uid);
    return { code: 200, message: 'Find user Success', data: { user: newUser } };
  }

  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiOkResponse({ description: 'Success', type: UserResponse })
  @ApiOperation({ summary: '유저 정보 업데이트' })
  @Put(':uid')
  async updateUser(@Param('uid') uid: string, @Body() dto: UpdateUserDto) {
    const newUser = this.usersService.updateUser(uid, dto);
    return {
      code: 200,
      message: 'Update user Success',
      data: { user: newUser },
    };
  }

  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiOperation({ summary: '유저 삭제하기' })
  @ApiOkResponse({ description: 'Success', type: UserResponse })
  @Delete(':uid')
  async deleteUser(@Param('uid') uid: string) {
    const deletedUser = this.usersService.deleteUser(uid);
    return {
      code: 200,
      message: 'Delete user Success',
      data: { user: deletedUser },
    };
  }
}
