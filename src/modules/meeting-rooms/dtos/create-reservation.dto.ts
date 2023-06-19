import { IsNotEmpty, IsNumber, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({
    example: 'q1w2e3r4asdasd',
    description: 'Unique id of user',
  })
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @ApiProperty({
    example: '101',
    description: 'Location of meeting room (id for room)',
  })
  @IsString()
  @IsNotEmpty()
  readonly meetingRoomLocation: string;

  @ApiProperty({
    example: 9,
    description: 'Start time of reservation',
    minimum: 9,
    maximum: 17,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly startTime: number;

  @ApiProperty({
    example: 10,
    description: 'End time of reservation',
    minimum: 10,
    maximum: 18,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly endTime: number;
}
