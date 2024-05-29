import { COMMAND_KEYS } from '@/telegram-bot/constants/command-keys';
import { Inject, Injectable } from '@nestjs/common';
import { StartHandler } from '../handlers/start.handler';
import { TestHandler } from '../handlers/test.handler';
import { Handler } from '../handlers/handler';

@Injectable()
export class HandlerService {
  @Inject(TestHandler)
  private readonly testHandler: TestHandler;

  @Inject(StartHandler)
  private startHandler: StartHandler;

  getHandlers(): Record<string, Handler> {
    return {
      [COMMAND_KEYS.TEST]: this.testHandler,
    };
  }
}
