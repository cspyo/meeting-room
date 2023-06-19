import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'testName',
        depart: 'testDepart',
      })
      .expect(201);
  });

  it('/users (GET)', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'testName',
      depart: 'testDepart',
    });
    const id = response.body.data.user.id;
    return request(app.getHttpServer()).get(`/users/${id}`).expect(200).expect({
      code: 200,
      message: 'Find user Success',
      data: response.body.data,
    });
  });

  it('/users (PUT)', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'testName',
      depart: 'testDepart',
    });
    const id = response.body.data.user.id;
    return request(app.getHttpServer())
      .put(`/users/${id}`)
      .send({
        depart: 'testDepart2',
      })
      .expect(200)
      .expect({
        code: 200,
        message: 'Update user Success',
        data: { user: { ...response.body.data.user, depart: 'testDepart2' } },
      });
  });

  it('/users (DELETE)', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'testName',
      depart: 'testDepart',
    });
    const id = response.body.data.user.id;
    return request(app.getHttpServer())
      .delete(`/users/${id}`)
      .expect(200)
      .expect({
        code: 200,
        message: 'Delete user Success',
        data: { user: response.body.data.user },
      });
  });

  describe('Error Handling', () => {
    it('User Not Found (404)', async () => {
      return request(app.getHttpServer()).get(`/users/123`).expect(404);
    });

    it('Create User Validation Error (400)', async () => {
      return request(app.getHttpServer())
        .post(`/users`)
        .send({
          name: 'testName',
        })
        .expect(400);
    });
  });
});
