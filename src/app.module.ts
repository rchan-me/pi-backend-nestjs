import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './config/app.config';
import prismaConfig from './config/prisma.config';
import { UsersModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, prismaConfig],
      envFilePath: ['.env'],
      expandVariables: true,
    }),
    UsersModule,
  ],
})
export class AppModule {}
