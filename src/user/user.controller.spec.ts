import { Test } from '@nestjs/testing';

import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            findUserById: jest.fn(),
            updateUser: jest.fn(),
            findMatchingUsersByName: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userController = moduleRef.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userController).toBeDefined();
  });

  describe('createUser', () => {
    it('should return one User record after finish creating', async () => {
      const timestamp = new Date('2023-01-01T00:00:00.000');

      const mockUser = {
        id: 'deadbeef-dead-beef-dead-123412341234',
        name: 'John Smith',
        email: 'john@smith.com',
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      jest
        .spyOn(userService, 'createUser')
        .mockImplementation(async () => mockUser);

      expect(
        await userController.createUser({
          name: 'John Smith',
          email: 'john@smith.com',
        }),
      ).toEqual(mockUser);
      expect(userService.createUser).toBeCalledWith({
        name: 'John Smith',
        email: 'john@smith.com',
      });
    });
  });

  describe('findUserById', () => {
    it('should return one User record because the user exists', async () => {
      const timestamp = new Date('2023-01-01T00:00:00.000');

      const mockUser = {
        id: 'deadbeef-dead-beef-dead-123412341234',
        name: 'John Smith',
        email: 'john@smith.com',
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      jest
        .spyOn(userService, 'findUserById')
        .mockImplementation(async () => mockUser);

      expect(
        await userController.findUserById(
          'deadbeef-dead-beef-dead-123412341234',
        ),
      ).toEqual(mockUser);
      expect(userService.findUserById).toBeCalledWith(
        'deadbeef-dead-beef-dead-123412341234',
      );
    });
  });

  describe('updateUser', () => {
    it('should update User record with the provided input', async () => {
      const timestamp = new Date('2023-01-01T00:00:00.000');

      const mockUser = {
        id: 'deadbeef-dead-beef-dead-123412341234',
        name: 'John Smith',
        email: 'john@smith.com',
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      const mockInput = { name: 'aaaa', email: 'aaaa@abc.com' };

      jest
        .spyOn(userService, 'updateUser')
        .mockImplementation(async (_, data) => ({
          ...mockUser,
          name: data.name,
          email: data.email,
        }));

      expect(
        await userController.updateUser(
          'deadbeef-dead-beef-dead-123412341234',
          mockInput,
        ),
      ).toEqual({ ...mockUser, name: mockInput.name, email: mockInput.email });
      expect(userService.updateUser).toBeCalledWith(
        'deadbeef-dead-beef-dead-123412341234',
        mockInput,
      );
    });
  });

  describe('findMatchingUsersByName', () => {
    it('should return an array of User records that match the inputted name pattern', async () => {
      const timestamp = new Date('2023-01-01T00:00:00.000');

      const mockUsers = [
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

      const mockSearchPattern = 'smith';

      jest
        .spyOn(userService, 'findMatchingUsersByName')
        .mockImplementation(async (pattern) => {
          return pattern === '*'
            ? mockUsers
            : mockUsers.filter((user) =>
                user.name.toLowerCase().includes(pattern),
              );
        });

      expect(
        await userController.findMatchingUsersByName(mockSearchPattern),
      ).toEqual(mockUsers.filter((user) => user.name !== 'Vernon Miller'));
      expect(userService.findMatchingUsersByName).toBeCalledWith(
        mockSearchPattern,
      );
    });

    it('should return an array of all User records due to wildcard pattern', async () => {
      const timestamp = new Date('2023-01-01T00:00:00.000');

      const mockUsers = [
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

      const mockSearchPattern = '*';

      jest
        .spyOn(userService, 'findMatchingUsersByName')
        .mockImplementation(async (pattern) => {
          return pattern === '*'
            ? mockUsers
            : mockUsers.filter((user) =>
                user.name.toLowerCase().includes(pattern),
              );
        });

      expect(
        await userController.findMatchingUsersByName(mockSearchPattern),
      ).toEqual(mockUsers);
      expect(userService.findMatchingUsersByName).toBeCalledWith(
        mockSearchPattern,
      );
    });
  });
});
