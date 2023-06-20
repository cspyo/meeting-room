import { ApiProperty } from '@nestjs/swagger';

export class MeetingRoom {
  @ApiProperty()
  location: string;

  @ApiProperty()
  floor: number;

  @ApiProperty()
  size: MeetingRoomSize;
}

export enum MeetingRoomSize {
  SMALL = 'small',
  MIDDLE = 'middle',
  BIG = 'big',
}
