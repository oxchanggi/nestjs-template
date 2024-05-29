import { InjectQueue } from '@nestjs/bull';
import { Global, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Queue } from 'bull';
import { QUEUE_NAME, QUEUE_PROCESSOR } from '../constants/queue';

@Global()
@Injectable()
export class QueueService implements OnApplicationBootstrap {
  constructor(@InjectQueue(QUEUE_NAME.MAIN_APP) private queue: Queue) {}
  onApplicationBootstrap() {
    // this.addJob({ test: 'test' }).then(console.log).catch(console.log);
  }

  async addJob(data: any) {
    await this.queue.add(
      QUEUE_PROCESSOR.DEFAULT,
      {
        data,
      },
      {
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }
}
