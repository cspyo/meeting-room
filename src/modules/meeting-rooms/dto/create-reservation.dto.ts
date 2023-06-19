import { IsNotEmpty, IsNumber, IsString } from '@nestjs/class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  readonly meetingRoomLocation: string;

  @IsNumber()
  @IsNotEmpty()
  readonly startTime: number;

  @IsNumber()
  @IsNotEmpty()
  readonly endTime: number;
}
