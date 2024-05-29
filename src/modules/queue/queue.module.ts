import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configQueue } from './configs';
import { DatabaseModule } from '@/database';
import { BullModule } from '@nestjs/bull';
import { Consumer } from './consumers';
import { QUEUE_NAME } from './constants/queue';
import { QueueService } from './services';

const consumers = [Consumer];
const services = [QueueService];

@Module({
  imports: [
    DatabaseModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const host = config.get<string>('queue.host');
        const port = config.get<number>('queue.port');
        const db = config.get<number>('queue.database');
        const password = config.get<string>('queue.password');

        return {
          redis: {
            host: host,
            port: port,
            db: db,
            password: password,
          },
        };
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: QUEUE_NAME.MAIN_APP,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [configQueue],
    }),
  ],
  controllers: [],
  providers: [...consumers, ...services],
  exports: [...services],
})
export class QueueModule {}
