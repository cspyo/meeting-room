import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MeetingRoomsService } from './meeting-rooms.service';
import { MeetingRoom, MeetingRoomSize } from '../entities/meeting-room.entity';
import { UpdateReservationDto } from '../dtos/update-reservation.dto';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let meetingRoomsService: MeetingRoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservationsService, MeetingRoomsService],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    meetingRoomsService = module.get<MeetingRoomsService>(MeetingRoomsService);

    // 매 단위 테스트 전에 예약 초기화
    service.resetReservations();

    // MeetingRoom에 test를 위한 정보를 따로 넣지 않고 mock 을 이용해 테스트
    const testMeetingRoom: MeetingRoom = {
      location: 'testLocation',
      floor: 1,
      size: MeetingRoomSize.BIG,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const meetingRoomsServicefindMeetingRoomSpy = jest
      .spyOn(meetingRoomsService, 'findMeetingRoomByLocation')
      .mockReturnValue(testMeetingRoom);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // 모든 예약 함수 테스트
  // 배열로 잘 반환하는지 확인
  describe('getAllReservations', () => {
    it('should return an array', () => {
      const result = service.getAllReservations();
      expect(result).toBeInstanceOf(Array);
    });
  });

  // ID 로 예약 찾는 함수 테스트
  describe('findReservationById', () => {
    it('should return a data', () => {
      const newReservation = service.createReservation({
        userId: 'testUserId',
        meetingRoomLocation: 'testLocation',
        startTime: 9,
        endTime: 10,
      });
      const data = service.findReservationById(newReservation.id);
      expect(data).toBeDefined();
      expect(data.userId).toEqual('testUserId');
      expect(data.meetingRoomLocation).toEqual('testLocation');
      expect(data.startTime).toEqual(9);
      expect(data.endTime).toEqual(10);
    });

    it('should throw 404 error', () => {
      try {
        service.findReservationById('');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toEqual(404);
      }
    });
  });

  // 예약 생성 함수 테스트
  describe('createReservation', () => {
    // 이상적인 상황에서 잘 생성되는지 확인
    it('should create a data', () => {
      const beforeData = service.getAllReservations().length;
      const newReservation = service.createReservation({
        userId: 'testUserId',
        meetingRoomLocation: 'testLocation',
        startTime: 9,
        endTime: 10,
      });
      const afterData = service.getAllReservations().length;
      expect(afterData).toBeGreaterThan(beforeData);
      expect(newReservation).toBeDefined();
    });

    // 예약 시간이 9~18시 사이인지 확인
    it('should throw 400 error when requested reservation time is out of range', () => {
      try {
        service.createReservation({
          userId: 'testUserId',
          meetingRoomLocation: 'testLocation',
          startTime: 8,
          endTime: 10,
        });
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.status).toEqual(400);
        expect(e.message).toEqual(`The reservation time is out of range`);
      }
    });

    // 하루 예약 제한 시간 6시간을 넘겼는지 확인
    it('should throw 400 error when the user has exceeded the maximum reservation hours per day', () => {
      service.createReservation({
        userId: 'testUserId',
        meetingRoomLocation: 'testLocation1',
        startTime: 9,
        endTime: 13,
      });
      try {
        service.createReservation({
          userId: 'testUserId',
          meetingRoomLocation: 'testLocation2',
          startTime: 10,
          endTime: 14,
        });
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.status).toEqual(400);
        expect(e.message).toEqual(
          `The user has exceeded the maximum reservation hours per day`,
        );
      }
    });

    // 요청한 예약에 겹치는 기존 예약이 있는지 확인
    it('should throw 400 error when requested reservation is conflict', () => {
      service.createReservation({
        userId: 'testUserId',
        meetingRoomLocation: 'testLocation',
        startTime: 9,
        endTime: 13,
      });
      try {
        service.createReservation({
          userId: 'testUserId',
          meetingRoomLocation: 'testLocation',
          startTime: 9,
          endTime: 11,
        });
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.status).toEqual(400);
        expect(e.message).toEqual(
          `The reservation time is conflict with same location meeting room`,
        );
      }
    });
  });

  // 예약 수정 함수 테스트
  describe('updateReservation', () => {
    // 이상적인 상황에서의 수정 확인
    it('should update a data', () => {
      const newReservation = service.createReservation({
        userId: 'testUserId',
        meetingRoomLocation: 'testLocation',
        startTime: 9,
        endTime: 13,
      });

      const updateReservationDto: UpdateReservationDto = {
        startTime: 10,
      };
      service.updateReservation(newReservation.id, updateReservationDto);
      const data = service.findReservationById(newReservation.id);
      expect(data.startTime).toEqual(10);
    });

    // 업데이트 할 예약을 찾지 못하면 에러
    it('should throw 404 error', () => {
      try {
        service.updateReservation('1', {});
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toEqual(404);
      }
    });

    // 예약 시간이 9~18시 사이인지 확인
    it('should throw 400 error when requested reservation time is out of range', () => {
      const newReservation = service.createReservation({
        userId: 'testUserId',
        meetingRoomLocation: 'testLocation',
        startTime: 9,
        endTime: 10,
      });
      try {
        const updateReservationDto: UpdateReservationDto = {
          startTime: 8,
        };
        service.updateReservation(newReservation.id, updateReservationDto);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.status).toEqual(400);
        expect(e.message).toEqual(`The reservation time is out of range`);
      }
    });

    // 하루 예약 제한 시간 6시간을 넘겼는지 확인
    it('should throw 400 error when the user has exceeded the maximum reservation hours per day', () => {
      service.createReservation({
        userId: 'testUserId',
        meetingRoomLocation: 'testLocation1',
        startTime: 9,
        endTime: 10,
      });
      const newReservation = service.createReservation({
        userId: 'testUserId',
        meetingRoomLocation: 'testLocation2',
        startTime: 9,
        endTime: 10,
      });
      try {
        const updateReservationDto: UpdateReservationDto = {
          endTime: 15,
        };
        service.updateReservation(newReservation.id, updateReservationDto);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.status).toEqual(400);
        expect(e.message).toEqual(
          `The user has exceeded the maximum reservation hours per day`,
        );
      }
    });

    // 요청한 예약에 겹치는 기존 예약이 있는지 확인
    it('should throw 400 error when requested reservation is conflict', () => {
      service.createReservation({
        userId: 'testUserId',
        meetingRoomLocation: 'testLocation1',
        startTime: 9,
        endTime: 10,
      });
      const newReservation = service.createReservation({
        userId: 'testUserId',
        meetingRoomLocation: 'testLocation2',
        startTime: 9,
        endTime: 10,
      });
      try {
        const updateReservationDto: UpdateReservationDto = {
          meetingRoomLocation: 'testLocation1',
        };
        service.updateReservation(newReservation.id, updateReservationDto);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.status).toEqual(400);
        expect(e.message).toEqual(
          `The reservation time is conflict with same location meeting room`,
        );
      }
    });
  });

  // 예약 삭제 함수 테스트
  describe('deleteReservation', () => {
    it('deletes a data', () => {
      const newReservation = service.createReservation({
        userId: 'testUserId',
        meetingRoomLocation: 'testLocation',
        startTime: 9,
        endTime: 10,
      });
      const beforeData = service.getAllReservations();
      service.deleteReservation(newReservation.id);
      const afterData = service.getAllReservations();
      expect(afterData.length).toBeLessThan(beforeData.length);
    });

    it('should throw 404 error', () => {
      try {
        service.deleteReservation('1');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toEqual(404);
      }
    });
  });

  // 예약 초기화 함수 테스트.
  describe('resetReservations', () => {
    it('should delete all data', () => {
      service.resetReservations();
      const afterData = service.getAllReservations().length;
      expect(afterData).toEqual(0);
    });
  });
});
