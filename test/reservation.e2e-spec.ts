import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ReservationsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/reservations (POST)', () => {
    return request(app.getHttpServer())
      .post('/reservations')
      .send({
        userId: 'testUserId',
        meetingRoomLocation: '101',
        startTime: 9,
        endTime: 10,
      })
      .expect(201);
  });

  it('/reservations (GET)', async () => {
    const response1 = await request(app.getHttpServer())
      .post('/reservations')
      .send({
        userId: 'testUserId',
        meetingRoomLocation: '101',
        startTime: 9,
        endTime: 10,
      });
    const response2 = await request(app.getHttpServer())
      .post('/reservations')
      .send({
        userId: 'testUserId',
        meetingRoomLocation: '107',
        startTime: 9,
        endTime: 10,
      });
    return request(app.getHttpServer())
      .get(`/reservations`)
      .expect(200)
      .expect({
        code: 200,
        message: 'Find All Reservations',
        data: {
          reservations: [
            response1.body.data.reservation,
            response2.body.data.reservation,
          ],
        },
      });
  });

  it('/reservations/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/reservations')
      .send({
        userId: 'testUserId',
        meetingRoomLocation: '101',
        startTime: 9,
        endTime: 10,
      });
    const id = response.body.data.reservation.id;
    return request(app.getHttpServer())
      .get(`/reservations/${id}`)
      .expect(200)
      .expect({
        code: 200,
        message: 'Find Reservation Success',
        data: { reservation: response.body.data.reservation },
      });
  });

  it('/reservations/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/reservations')
      .send({
        userId: 'testUserId',
        meetingRoomLocation: '101',
        startTime: 9,
        endTime: 10,
      });
    const id = response.body.data.reservation.id;
    return request(app.getHttpServer())
      .put(`/reservations/${id}`)
      .send({
        endTime: 11,
      })
      .expect(200)
      .expect({
        code: 200,
        message: 'Update Reservation Success',
        data: {
          reservation: { ...response.body.data.reservation, endTime: 11 },
        },
      });
  });

  it('/reservations/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/reservations')
      .send({
        userId: 'testUserId',
        meetingRoomLocation: '101',
        startTime: 9,
        endTime: 10,
      });
    const id = response.body.data.reservation.id;
    return request(app.getHttpServer())
      .delete(`/reservations/${id}`)
      .expect(200);
  });

  describe('Error Handling', () => {
    it('Reservation Not Found (404)', async () => {
      return request(app.getHttpServer()).get(`/reservations/1`).expect(404);
    });

    it('Create Reservation : Data Validation Error (400)', async () => {
      return request(app.getHttpServer())
        .post(`/reservations`)
        .send({
          userId: 'testUserId',
        })
        .expect(400);
    });

    it('Create Reservation : Validate User Total Time Error (400)', async () => {
      await request(app.getHttpServer()).post('/reservations').send({
        userId: 'testUserId',
        meetingRoomLocation: '107',
        startTime: 9,
        endTime: 10,
      });
      return await request(app.getHttpServer())
        .post('/reservations')
        .send({
          userId: 'testUserId',
          meetingRoomLocation: '101',
          startTime: 9,
          endTime: 15,
        })
        .expect(400);
    });

    it('Create Reservation : Validate Conflict Reservation Error (400)', async () => {
      await request(app.getHttpServer()).post('/reservations').send({
        userId: 'testUserId',
        meetingRoomLocation: '107',
        startTime: 9,
        endTime: 12,
      });
      return await request(app.getHttpServer())
        .post('/reservations')
        .send({
          userId: 'testUserId',
          meetingRoomLocation: '107',
          startTime: 10,
          endTime: 11,
        })
        .expect(400);
    });

    it('Create Reservation : Validate Reservation Time Range Error (400)', async () => {
      return await request(app.getHttpServer())
        .post('/reservations')
        .send({
          userId: 'testUserId',
          meetingRoomLocation: '107',
          startTime: 8,
          endTime: 11,
        })
        .expect(400);
    });

    it('Update Reservation : Validate User Total Time Error (400)', async () => {
      const response = await request(app.getHttpServer())
        .post('/reservations')
        .send({
          userId: 'testUserId',
          meetingRoomLocation: '107',
          startTime: 9,
          endTime: 10,
        });
      const id = response.body.data.reservation.id;
      return await request(app.getHttpServer())
        .put(`/reservations/${id}`)
        .send({
          endTime: 17,
        })
        .expect(400);
    });

    it('Update Reservation : Validate Conflict Reservation Error (400)', async () => {
      await request(app.getHttpServer()).post('/reservations').send({
        userId: 'testUserId',
        meetingRoomLocation: '101',
        startTime: 9,
        endTime: 12,
      });
      const response = await request(app.getHttpServer())
        .post('/reservations')
        .send({
          userId: 'testUserId2',
          meetingRoomLocation: '107',
          startTime: 9,
          endTime: 10,
        });
      const id = response.body.data.reservation.id;
      return await request(app.getHttpServer())
        .put(`/reservations/${id}`)
        .send({
          meetingRoomLocation: '101',
          startTime: 9,
          endTime: 13,
        })
        .expect(400);
    });

    it('Update Reservation : Validate Reservation Time Range Error (400)', async () => {
      const response = await request(app.getHttpServer())
        .post('/reservations')
        .send({
          userId: 'testUserId',
          meetingRoomLocation: '107',
          startTime: 9,
          endTime: 10,
        });
      const id = response.body.data.reservation.id;
      return await request(app.getHttpServer())
        .put(`/reservations/${id}`)
        .send({
          startTime: 8,
          endTime: 13,
        })
        .expect(400);
    });
  });
});
