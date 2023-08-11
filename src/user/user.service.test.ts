import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { Test } from '@nestjs/testing';
import { UserData } from './user.type';
import { HttpException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;

  let findUniqueMock: jest.Mock;
  let createMock: jest.Mock;
  let updateMock: jest.Mock;
  let findManyMock: jest.Mock;

  beforeEach(async () => {
    findUniqueMock = jest.fn();
    createMock = jest.fn();
    updateMock = jest.fn();
    findManyMock = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: findUniqueMock,
              create: createMock,
              update: updateMock,
              findMany: findManyMock,
            },
          },
        },
      ],
    }).compile();

    userService = await module.get(UserService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createUser', () => {
    let user: User;

    beforeEach(() => {
      const timestamp = new Date('2023-01-01T00:00:00.000');
      user = {
        id: 'deadbeef-dead-beef-dead-123412341234',
        name: 'John Smith',
        email: 'john@smith.com',
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      createMock.mockResolvedValue(user);
    });

    it('can create a new user correctly when receiving valid data', async () => {
      const payload = { name: 'John Smith', email: 'john@smith.com' };

      const result = await userService.createUser(payload);
      expect(result).toStrictEqual(user);
    });

    it('throws an error due to bad data', () => {
      createMock.mockImplementation((data) => {
        if (!data.name || !data.email) {
          throw new Error();
        }
      });

      const payload = { notExist: true } as unknown as UserData;

      return expect(async () => {
        await userService.createUser(payload);
      }).rejects.toBeInstanceOf(HttpException);
    });
  });

  describe('findUserById', () => {
    let user: User;

    beforeEach(() => {
      const timestamp = new Date('2023-01-01T00:00:00.000');
      user = {
        id: 'deadbeef-dead-beef-dead-123412341234',
        name: 'John Smith',
        email: 'john@smith.com',
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      findUniqueMock.mockResolvedValue(user);
    });

    it('can find an existing user if userId is correct', async () => {
      const mockUserId = 'deadbeef-dead-beef-dead-123412341234';

      const result = await userService.findUserById(mockUserId);
      expect(findUniqueMock).toBeCalledTimes(1);
      expect(result).toStrictEqual(user);
    });

    it('returns null if user does not exist', async () => {
      findUniqueMock.mockResolvedValue(null);
      const mockUserId = 'does-not-exist';

      expect(await userService.findUserById(mockUserId)).toBeNull();
    });
  });

  describe('updateUser', () => {
    let user: User;

    beforeEach(() => {
      const timestamp = new Date('2023-01-01T00:00:00.000');
      user = {
        id: 'deadbeef-dead-beef-dead-123412341234',
        name: 'John Smith',
        email: 'john@smith.com',
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      updateMock.mockImplementation((args) => ({
        ...user,
        name: args.data.name,
        email: args.data.email,
      }));
    });

    it("can update an existing user's data", async () => {
      const mockUserId = 'deadbeef-dead-beef-dead-123412341234';
      const payload = { name: 'Nick Jonas', email: 'nick@jonas.com' };

      const result = await userService.updateUser(mockUserId, payload);
      expect(updateMock).toHaveBeenCalled();
      expect(updateMock).toHaveBeenCalledWith({
        data: { name: 'Nick Jonas', email: 'nick@jonas.com' },
        where: { id: 'deadbeef-dead-beef-dead-123412341234' },
      });

      expect(result).toStrictEqual({
        ...user,
        name: payload.name,
        email: payload.email,
      });
    });

    it('throws error since user does not exist', () => {
      const mockValidId = 'deadbeef-dead-beef-dead-123412341234';
      updateMock.mockImplementation((args) => {
        if (args.where.id !== mockValidId) {
          throw new Error();
        }
      });

      const mockUserId = 'does-not-exist';
      const payload = {} as unknown as UserData;

      return expect(async () => {
        await userService.updateUser(mockUserId, payload);
      }).rejects.toBeInstanceOf(HttpException);
    });
  });

  describe('findMatchingUsersByName', () => {
    let users: User[];
    let timestamp: Date;

    beforeEach(() => {
      timestamp = new Date('2023-01-01T00:00:00.000');
      users = [
        {
          id: 'deadbeef-dead-beef-dead-123412341234',
          name: 'John Smith',
          email: 'john@smith.com',
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          id: 'deadbeef-dead-beef-dead-567887655678',
          name: 'Paul Smith',
          email: 'paul@smith.com',
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          id: 'deadbeef-dead-beef-dead-abcdabcdabcd',
          name: 'Vernon Miller',
          email: 'vernon@miller.com',
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ];
      findManyMock.mockImplementation((args) => {
        return Object.keys(args).length === 0
          ? users
          : users.filter((user) =>
              user.name.toLowerCase().includes(args.where.name.contains),
            );
      });
    });

    it('returns an array of user whose name matches the given pattern', async () => {
      const mockNamePattern = 'smith';

      const result = await userService.findMatchingUsersByName(mockNamePattern);
      expect(result).toStrictEqual([
        {
          id: 'deadbeef-dead-beef-dead-123412341234',
          name: 'John Smith',
          email: 'john@smith.com',
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          id: 'deadbeef-dead-beef-dead-567887655678',
          name: 'Paul Smith',
          email: 'paul@smith.com',
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ]);
    });

    it('returns an empty array since there are no matches for the given pattern', async () => {
      const mockNamePattern = 'noone';

      const result = await userService.findMatchingUsersByName(mockNamePattern);
      expect(result).toStrictEqual([]);
    });

    it('returns all users due to being given the wildcard pattern', async () => {
      const mockNamePattern = '*';

      const result = await userService.findMatchingUsersByName(mockNamePattern);
      expect(result).toStrictEqual(users);
    });
  });
});
