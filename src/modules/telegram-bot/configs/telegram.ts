import { registerAs } from '@nestjs/config';
import process from 'process';
import fs from 'fs';
import path from 'path';

// const serverCaProd = fs.readFileSync(
//   path.join(__dirname, '../../../ssl/redis/prod/server-ca.pem'),
// );

// const serverCaStag = fs.readFileSync(
//   path.join(__dirname, '../../../ssl/redis/stag/server-ca.pem'),
// );
export const configTelegram = registerAs('telegram', () => ({
  token: process.env.TELEGRAM_TOKEN,
  state: {
    host: process.env.TELEGRAM_STATE_HOST,
    port: process.env.TELEGRAM_STATE_PORT,
    database: process.env.TELEGRAM_STATE_DATABASE,
    password: process.env.TELEGRAM_STATE_PASSWORD,
    // tls:
    //   process.env.APP_ENV == 'production' ||
    //   process.env.APP_ENV == 'staging' ||
    //   process.env.APP_ENV == 'develop'
    //     ? {
    //         ca:
    //           process.env.APP_ENV == 'production' ? serverCaProd : serverCaStag,
    //       }
    //     : null,
  },
  wallet: {
    connect: process.env.CONNECT_WALLET_LINK,
  },
}));
