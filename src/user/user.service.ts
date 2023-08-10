import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
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
    return this.prisma.user.findMany({
      where: { name: { contains: pattern } },
    });
  }
}
