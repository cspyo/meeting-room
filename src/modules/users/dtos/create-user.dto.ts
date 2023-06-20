import { IsNotEmpty, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Gildong Hong',
    description: 'Name of user',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: 'TeamA',
    description: 'Depart of user',
  })
  @IsString()
  @IsNotEmpty()
  readonly depart: string;
}
