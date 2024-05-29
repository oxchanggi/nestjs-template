import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database';
import { ApiModule } from '@/api';
import { TelegramBotModule } from '@/telegram-bot';

@Module({
  imports: [DatabaseModule, ApiModule, TelegramBotModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
