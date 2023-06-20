import { IsNumber, IsOptional, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReservationDto {
  @ApiProperty({
    example: 'q1w2e3r4asdasd',
    description: 'Unique id of user',
  })
  @IsString()
  @IsOptional()
  readonly userId?: string;

  @ApiProperty({
    example: '101',
    description: 'Location of meeting room (id for room)',
  })
  @IsString()
  @IsOptional()
  readonly meetingRoomLocation?: string;

  @ApiProperty({
    example: 9,
    description: 'Start time of reservation',
    minimum: 9,
    maximum: 17,
  })
  @IsNumber()
  @IsOptional()
  readonly startTime?: number;

  @ApiProperty({
    example: 10,
    description: 'End time of reservation',
    minimum: 10,
    maximum: 18,
  })
  @IsNumber()
  @IsOptional()
  readonly endTime?: number;
}
