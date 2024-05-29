import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database';
import { ApiModule } from '@/api';
import { TelegramBotModule } from '@/telegram-bot';
import { WorkerModule } from '@/worker';

@Module({
  imports: [DatabaseModule, ApiModule, TelegramBotModule, WorkerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
