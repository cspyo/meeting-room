import { Controller, Get, Inject, Param } from '@nestjs/common';
import { MeetingRoomsService } from '../services/meeting-rooms.service';
import {
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { MeetingRoomResponse } from '../responses/meeting-room.response';
import { MeetingRoomsResponse } from '../responses/meeting-rooms.response';
@ApiTags('Meeting Rooms')
@Controller('meeting-rooms')
export class MeetingRoomsController {
  constructor(
    @Inject(MeetingRoomsService)
    private readonly meetingRoomService: MeetingRoomsService,
  ) {}

  @ApiOkResponse({
    description: 'Success',
    type: MeetingRoomsResponse,
  })
  @ApiOperation({ summary: '모든 회의실 정보 가져오기' })
  @Get()
  async getMeetingRoomsInfo() {
    const meetingRooms = this.meetingRoomService.getAllMeetingRooms();
    return {
      code: 200,
      message: 'Find All Meeting Rooms',
      data: { meetingRooms: meetingRooms },
    };
  }

  @ApiNotFoundResponse({ description: 'Meeting room not found' })
  @ApiOkResponse({
    description: 'Success',
    type: MeetingRoomResponse,
  })
  @ApiOperation({ summary: 'Location 으로 회의실 정보 가져오기' })
  @Get(':location')
  async getMeetingRoomByLocation(@Param('location') location: string) {
    const meetingRoom =
      this.meetingRoomService.findMeetingRoomByLocation(location);
    return {
      code: 200,
      message: 'Find Meeting Room Success',
      data: { meetingRoom: meetingRoom },
    };
  }
}
