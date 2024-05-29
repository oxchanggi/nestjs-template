import { BlockchainModule } from '@/blockchain';
import { DatabaseModule } from '@/database';
import {
  configBlockchain,
  configQueue,
  configTelegram,
} from '@/telegram-bot/configs';
import { TelegramBotConsumer } from '@/telegram-bot/consumers/telegram-bot.consumer';
import { HandlerService } from '@/telegram-bot/services';
import { TelegramBot } from '@/telegram-bot/telegram-bot';
import { BullModule } from '@nestjs/bull';
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import Redis from 'ioredis';
import { QUEUE_NAME } from './constants/queue';
import { TestHandler } from './handlers/test.handler';
import { StartHandler } from './handlers/start.handler';

const handlers = [TestHandler, StartHandler];

const services = [HandlerService];

const consumers = [];
const isQueue = Boolean(Number(process.env.IS_QUEUE || 0));
if (isQueue) {
  consumers.push(TelegramBotConsumer);
} else {
}

@Module({
  imports: [
    DatabaseModule,
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const host = config.get<string>('queue.host');
        const port = config.get<number>('queue.port');
        const db = config.get<number>('queue.database');
        const password = config.get<string>('queue.password');
        const tls = config.get('queue.tls');
        return {
          redis: {
            host: host,
            port: port,
            db: db,
            password: password,
            tls,
          },
        };
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: QUEUE_NAME.TELEGRAM_BOT,
    }),
    BlockchainModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('blockchain'),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [configTelegram, configBlockchain, configQueue],
    }),
  ],
  controllers: [],
  providers: [
    ...handlers,
    TelegramBot,
    ...consumers,
    ...services,
    {
      provide: 'TELEGRAM_BOT_STATE',
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('telegram.state.host');
        const port = configService.get<string>('telegram.state.port');
        const database = configService.get<number>('telegram.state.database');
        const password = configService.get<string>('telegram.state.password');
        const tls = configService.get('telegram.state.tls');
        const redis = new Redis({
          host,
          port: Number(port),
          lazyConnect: true,
          db: Number(database),
          password: password,
          tls,
        });
        return redis;
      },
      inject: [ConfigService],
    },
  ],
  exports: [TelegramBot],
})
export class TelegramBotModule implements OnApplicationBootstrap {
  constructor(
    private telegramBot: TelegramBot,
    private handlerService: HandlerService,
  ) {}

  async onApplicationBootstrap() {
    const handlers = this.handlerService.getHandlers();
    this.telegramBot.registerHandlers(handlers);
    await this.telegramBot.start();
  }
}
