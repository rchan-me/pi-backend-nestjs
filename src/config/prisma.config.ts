import { registerAs } from '@nestjs/config';

import { PrismaConfig } from './config.type';

export default registerAs<PrismaConfig>('database', () => ({
  url: process.env.DATABASE_URL,
}));
