import { Test, TestingModule } from '@nestjs/testing';
import { MeetingRoomsController } from './meeting-rooms.controller';
import { MeetingRoomsService } from '../services/meeting-rooms.service';

describe('MeetingRoomsController', () => {
  let controller: MeetingRoomsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeetingRoomsController],
      providers: [MeetingRoomsService],
    }).compile();

    controller = module.get<MeetingRoomsController>(MeetingRoomsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
