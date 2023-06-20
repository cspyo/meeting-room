import { ApiProperty } from '@nestjs/swagger';
import { MeetingRoom } from '../entities/meeting-room.entity';

export abstract class MeetingRoomResponseData {
  @ApiProperty()
  meetingRoom: MeetingRoom;
}

export abstract class MeetingRoomResponse {
  @ApiProperty()
  code: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: MeetingRoomResponseData;
}
