import { registerAs } from '@nestjs/config';

import { AppConfig } from './config.type';

export default registerAs<AppConfig>('app', () => ({
  port: Number(process.env.APP_PORT),
}));
