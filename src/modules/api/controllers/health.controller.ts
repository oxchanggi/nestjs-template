import { QueueService } from '@/queue/services';
import { Controller, Get, HttpStatus, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Inject(QueueService)
  private readonly queueService: QueueService;

  @Get()
  async healthCheck() {
    return { status: HttpStatus.OK, message: 'OK' };
  }

  @Get('/queue')
  async queueHealthCheck() {
    await this.queueService.addJob({ test: 'test' });
    return { status: HttpStatus.OK, message: 'OK' };
  }
}
