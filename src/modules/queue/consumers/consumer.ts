import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QUEUE_NAME, QUEUE_PROCESSOR } from '../constants/queue';

@Processor(QUEUE_NAME.MAIN_APP)
export class Consumer {
  @Process(QUEUE_PROCESSOR.DEFAULT)
  async executeTxnLogs(job: Job) {
    console.log('🚀 ~ Consumer ~ job:', job.data);
  }
}
