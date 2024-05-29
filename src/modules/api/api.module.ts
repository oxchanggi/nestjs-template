import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database';
import { AuthController, HealthController } from '@/api/controllers';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from '@/api/services';
import { LoggerModule } from '@/logger';
import { QueueModule } from '@/queue';

@Module({
  imports: [
    LoggerModule,
    DatabaseModule,
    QueueModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [],
    }),
  ],
  controllers: [HealthController, AuthController],
  providers: [AuthService],
})
export class ApiModule {}
