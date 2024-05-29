import { Cron } from '@nestjs/schedule';
import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { QueueService } from '@/queue/services';

@Injectable()
export class ScheduleService implements OnApplicationBootstrap {
  @Inject(QueueService)
  private readonly queueService: QueueService;

  async onApplicationBootstrap() {}

  @Cron('*/10 * * * * *')
  async handleCron() {
    console.log('Call queue service');
    await this.queueService.addJob({ test: 'test' });
  }
}
