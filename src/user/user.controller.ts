import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';

import { UserService } from './user.service';
import { UserData } from './user.type';

@Controller({
  path: 'users',
})
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('new')
  async createUser(
    @Body() userData: UserData,
  ): Promise<UserModel> {
    return this.userService.createUser(userData)
  }

  @Get(':userId')
  async findUserById(@Param('userId') userId: string): Promise<UserModel> {
    return this.userService.findUserById(userId);
  }

  @Put(':userId')
  async updateUser(@Param('userId') userId: string, @Body() userData: UserData,): Promise<UserModel> {
    return this.userService.updateUser(userId, userData);
  }

  @Get('search/:text')
  async findMatchingUsersByName(@Param('text') text: string): Promise<UserModel[]> {
    return this.userService.findMatchingUsersByName(text);
  }
}
