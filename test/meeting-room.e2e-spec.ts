import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('MeetingRoomsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/meeting-rooms (GET)', async () => {
    return request(app.getHttpServer()).get(`/meeting-rooms`).expect(200);
  });

  it('/meeting-rooms/:location (GET)', async () => {
    const meetingRoom101 = {
      location: '101',
      floor: 1,
      size: 'small',
    };
    return request(app.getHttpServer())
      .get(`/meeting-rooms/101`)
      .expect(200)
      .expect(meetingRoom101);
  });

  describe('Error Handling', () => {
    it('Meeting room Not Found (404)', async () => {
      return request(app.getHttpServer()).get(`/meeting-rooms/1`).expect(404);
    });
  });
});
