import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an arry', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('create', () => {
    it('should create a data', () => {
      const beforeData = service.getAll().length;
      const newUser = service.createUser({
        name: 'testName',
        depart: 'testDepart',
      });
      const afterData = service.getAll().length;
      expect(afterData).toBeGreaterThan(beforeData);
      expect(newUser).toBeDefined();
    });
  });

  describe('getOne', () => {
    it('should return a data', () => {
      const newUser = service.createUser({
        name: 'testName',
        depart: 'testDepart',
      });
      const data = service.findUserById(newUser.id);
      expect(data).toBeDefined();
      expect(data.name).toEqual('testName');
      expect(data.depart).toEqual('testDepart');
    });

    it('should throw 404 error', () => {
      try {
        service.findUserById('');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toEqual(404);
      }
    });
  });

  describe('deleteOne', () => {
    it('deletes a data', () => {
      const newUser = service.createUser({
        name: 'testName',
        depart: 'testDepart',
      });
      const beforeData = service.getAll();
      const deletedUser = service.deleteUser(newUser.id);
      const afterData = service.getAll();
      expect(afterData.length).toBeLessThan(beforeData.length);
      expect(newUser.id).toEqual(deletedUser.id);
    });

    it('should throw 404 error', () => {
      try {
        service.deleteUser('1');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toEqual(404);
      }
    });
  });

  describe('updateOne', () => {
    it('should update a data', () => {
      const newUser = service.createUser({
        name: 'testName',
        depart: 'testDepart',
      });
      service.updateUser(newUser.id, { depart: 'testDepart2' });
      const data = service.findUserById(newUser.id);
      expect(data.depart).toEqual('testDepart2');
    });

    it('should throw 404 error', () => {
      try {
        service.updateUser('1', {});
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toEqual(404);
      }
    });
  });
});
