import { ApiProperty } from '@nestjs/swagger';

export class Reservation {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  meetingRoomLocation: string;

  @ApiProperty()
  startTime: number;

  @ApiProperty()
  endTime: number;
}
