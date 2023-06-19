import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export abstract class UserResponseData {
  @ApiProperty()
  user: User;
}

export abstract class UserResponse {
  @ApiProperty()
  code: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: UserResponseData;
}
