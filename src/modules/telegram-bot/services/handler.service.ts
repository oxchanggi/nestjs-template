import { COMMAND_KEYS } from '@/telegram-bot/constants/command-keys';
import {
  Handler,
  StartHandler,
  TestHandler,
} from '@/telegram-bot/handlers';
import { Inject, Injectable } from '@nestjs/common';

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
