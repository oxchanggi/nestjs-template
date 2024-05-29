import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database';
import { ApiModule } from '@/api';
import { TelegramBotModule } from '@/telegram-bot';
import { WorkerModule } from '@/worker';
import { QueueModule } from '@/queue';
import { BlockchainModule } from '@/blockchain';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configBlockchain } from '@/blockchain/configs/blockchain';

@Module({
  imports: [
    DatabaseModule,
    ApiModule,
    TelegramBotModule,
    WorkerModule,
    QueueModule,
    BlockchainModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('blockchain'),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [configBlockchain],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
