import { IsString } from '@nestjs/class-validator';
import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly depart?: string;
}
