import { Injectable, NotFoundException } from '@nestjs/common';
import { MeetingRoom, MeetingRoomSize } from '../entities/meeting-room.entity';

@Injectable()
export class MeetingRoomsService {
  private meetingRooms: Map<string, MeetingRoom>;

  constructor() {
    this.meetingRooms = new Map();
    this.makeMeetingRoomsData();
  }

  createMeetingRoom(meetingRoom: MeetingRoom): MeetingRoom {
    this.meetingRooms.set(meetingRoom.location, meetingRoom);
    return meetingRoom;
  }

  getAllMeetingRooms(): MeetingRoom[] {
    return Array.from(this.meetingRooms.values());
  }

  findMeetingRoomByLocation(location: string): MeetingRoom {
    const meetingRoom = this.meetingRooms.get(location);
    if (!meetingRoom) {
      throw new NotFoundException(`Meeting room ${location} not found`);
    }
    return meetingRoom;
  }

  deleteAllMeetingRoom() {
    this.meetingRooms.clear();
  }

  makeMeetingRoomsData() {
    let meetingRoom: MeetingRoom = {
      location: '101',
      floor: 1,
      size: MeetingRoomSize.SMALL,
    };
    this.createMeetingRoom(meetingRoom);

    meetingRoom = {
      location: '107',
      floor: 1,
      size: MeetingRoomSize.BIG,
    };
    this.createMeetingRoom(meetingRoom);

    meetingRoom = {
      location: '312',
      floor: 3,
      size: MeetingRoomSize.BIG,
    };
    this.createMeetingRoom(meetingRoom);

    meetingRoom = {
      location: '402',
      floor: 4,
      size: MeetingRoomSize.SMALL,
    };
    this.createMeetingRoom(meetingRoom);

    meetingRoom = {
      location: '403',
      floor: 4,
      size: MeetingRoomSize.SMALL,
    };
    this.createMeetingRoom(meetingRoom);

    meetingRoom = {
      location: '509',
      floor: 5,
      size: MeetingRoomSize.MIDDLE,
    };
    this.createMeetingRoom(meetingRoom);

    meetingRoom = {
      location: '804',
      floor: 8,
      size: MeetingRoomSize.BIG,
    };
    this.createMeetingRoom(meetingRoom);

    meetingRoom = {
      location: '1001',
      floor: 10,
      size: MeetingRoomSize.BIG,
    };
    this.createMeetingRoom(meetingRoom);
  }
}
