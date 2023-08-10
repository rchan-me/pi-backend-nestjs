import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { UserData } from './user.type';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: UserData): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findUserById(
    userId: string
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async updateUser(
    userId: string,
    data: UserData
  ): Promise<User> {
    return this.prisma.user.update({
      data,
      where: { id: userId },
    });
  }

  async findMatchingUsersByName(pattern: string): Promise<User[]> {
    const findManyArgs: Prisma.UserFindManyArgs = pattern === '*' ? {} : {
      where: { name: { contains: pattern } }
    }
    return this.prisma.user.findMany(findManyArgs);
  }
}
