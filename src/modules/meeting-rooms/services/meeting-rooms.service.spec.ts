import { Test, TestingModule } from '@nestjs/testing';
import { MeetingRoomsService } from './meeting-rooms.service';
import { MeetingRoomSize } from '../entities/meeting-room.entity';
import { NotFoundException } from '@nestjs/common';

describe('MeetingRoomsService', () => {
  let service: MeetingRoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeetingRoomsService],
    }).compile();

    service = module.get<MeetingRoomsService>(MeetingRoomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllMeetingRooms', () => {
    it('should return an array', () => {
      const result = service.getAllMeetingRooms();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('createMeetingRoom', () => {
    it('should create a data', () => {
      const beforeData = service.getAllMeetingRooms().length;
      const newMeetingRoom = service.createMeetingRoom({
        location: 'testLocation',
        floor: 10,
        size: MeetingRoomSize.SMALL,
      });
      const afterData = service.getAllMeetingRooms().length;
      expect(afterData).toBeGreaterThan(beforeData);
      expect(newMeetingRoom).toBeDefined();
    });
  });

  describe('findMeetingRoomByLocation', () => {
    it('should return a data', () => {
      const newMeetingRoom = service.createMeetingRoom({
        location: 'testLocation',
        floor: 10,
        size: MeetingRoomSize.SMALL,
      });
      const data = service.findMeetingRoomByLocation(newMeetingRoom.location);
      expect(data).toBeDefined();
      expect(data.location).toEqual('testLocation');
      expect(data.floor).toEqual(10);
      expect(data.size).toEqual(MeetingRoomSize.SMALL);
    });

    it('should throw 404 error', () => {
      try {
        service.findMeetingRoomByLocation('');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toEqual(404);
      }
    });
  });

  describe('deleteAllMeetingRoom', () => {
    it('should delete all data', () => {
      service.deleteAllMeetingRoom();
      const afterData = service.getAllMeetingRooms().length;
      expect(afterData).toEqual(0);
    });
  });

  describe('makeMeetingRoomsData', () => {
    it('should make 8 data', () => {
      service.deleteAllMeetingRoom();
      service.makeMeetingRoomsData();
      const afterData = service.getAllMeetingRooms().length;
      expect(afterData).toEqual(8);
    });
  });
});
