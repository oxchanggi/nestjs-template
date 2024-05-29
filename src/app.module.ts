import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database';
import { ApiModule } from '@/api';
import { TelegramBotModule } from '@/telegram-bot';
import { WorkerModule } from '@/worker';
import { QueueModule } from '@/queue';

@Module({
  imports: [
    DatabaseModule,
    ApiModule,
    TelegramBotModule,
    WorkerModule,
    QueueModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
