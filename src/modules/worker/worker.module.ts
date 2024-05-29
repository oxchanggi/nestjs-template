import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database';
import { ScheduleService } from './schedulers/schedule.service';
import { ScheduleModule } from '@nestjs/schedule';
import { QueueModule } from '@/queue';

const isWorker = Boolean(Number(process.env.IS_WORKER || 0));

let schedulers = [];
if (isWorker) {
  schedulers = [ScheduleService];
}

@Module({
  imports: [DatabaseModule, ScheduleModule.forRoot(), QueueModule],
  controllers: [],
  providers: [...schedulers],
  exports: [],
})
export class WorkerModule {}
