import { IsNumber, IsOptional, IsString } from '@nestjs/class-validator';

export class UpdateReservationDto {
  @IsString()
  @IsOptional()
  readonly userId?: string;

  @IsString()
  @IsOptional()
  readonly meetingRoomLocation?: string;

  @IsNumber()
  @IsOptional()
  readonly startTime?: number;

  @IsNumber()
  @IsOptional()
  readonly endTime?: number;
}
