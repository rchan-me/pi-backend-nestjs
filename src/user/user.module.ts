import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserService } from './user.service';
import { UsersController } from './user.controller';

@Module({
  controllers: [UsersController],
  imports: [PrismaModule],
  providers: [UserService],
})
export class UsersModule {}
