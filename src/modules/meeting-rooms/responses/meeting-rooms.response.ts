import { ApiProperty } from '@nestjs/swagger';
import { MeetingRoom } from '../entities/meeting-room.entity';

export abstract class MeetingRoomsResponseData {
  @ApiProperty({
    type: [MeetingRoom],
  })
  meetingRooms: MeetingRoom[];
}

export abstract class MeetingRoomsResponse {
  @ApiProperty()
  code: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: MeetingRoomsResponseData;
}
