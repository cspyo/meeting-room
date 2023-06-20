import { IsString } from '@nestjs/class-validator';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'Gildong Hong',
    description: 'Name of user',
  })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiProperty({
    example: 'TeamA',
    description: 'Depart of user',
  })
  @IsString()
  @IsOptional()
  readonly depart?: string;
}
