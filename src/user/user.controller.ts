import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { UserService } from './user.service';
import { UserData } from './user.type';

@ApiTags('users')
@Controller({
  path: 'users',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('new')
  @ApiOperation({ summary: 'Create new user from name and email' })
  @ApiBody({
    type: UserData,
    required: true,
  })
  async createUser(@Body() userData: UserData): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Find a user based on the given userId' })
  async findUserById(@Param('userId') userId: string): Promise<User> {
    return this.userService.findUserById(userId);
  }

  @Put(':userId')
  @ApiOperation({
    summary: 'Update data (name and/or email) of a given userId, if exists',
  })
  @ApiBody({
    type: UserData,
    required: true,
  })
  async updateUser(
    @Param('userId') userId: string,
    @Body() userData: UserData,
  ): Promise<User> {
    return this.userService.updateUser(userId, userData);
  }

  @Get('search/:text')
  @ApiOperation({
    summary:
      'Search users by name based on the given text. Supports a partial string or wildcard',
  })
  async findMatchingUsersByName(@Param('text') text: string): Promise<User[]> {
    return this.userService.findMatchingUsersByName(text);
  }
}
