import { Cron } from '@nestjs/schedule';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class ScheduleService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {}

  @Cron('*/1 * * * * *')
  async handleCron() {
    console.log('Called when the current second is 1');
  }
}
