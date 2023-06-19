import { Controller, Get, Inject, Param } from '@nestjs/common';
import { MeetingRoomsService } from '../services/meeting-rooms.service';

@Controller('meeting-rooms')
export class MeetingRoomsController {
  constructor(
    @Inject(MeetingRoomsService)
    private readonly meetingRoomService: MeetingRoomsService,
  ) {}

  @Get()
  async getMeetingRoomsInfo() {
    return this.meetingRoomService.getAllMeetingRooms();
  }

  @Get(':location')
  async getMeetingRoomByLocation(@Param('location') location: string) {
    return this.meetingRoomService.findMeetingRoomByLocation(location);
  }
}
