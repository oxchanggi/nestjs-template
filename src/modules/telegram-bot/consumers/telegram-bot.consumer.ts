import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QUEUE_NAME, QUEUE_PROCESSOR } from '@/telegram-bot/constants/queue';
import { TelegramBot } from '@/telegram-bot/telegram-bot';
import { Inject } from '@nestjs/common';

@Processor(QUEUE_NAME.TELEGRAM_BOT)
export class TelegramBotConsumer {
  @Inject(TelegramBot)
  private readonly bot: TelegramBot;

  @Process(QUEUE_PROCESSOR.TELEGRAM_BOT.POOLING_QUEUE)
  async sendMessage(
    job: Job<{
      cmd: string;
      params: Record<string, any>;
      data: any;
    }>,
  ) {
    const { cmd, params, data } = job.data;

    const handler = this.bot.handlers[cmd];
    if (handler) {
      handler
        .handler({ ...data, ...params })
        .then()
        .catch((e) => {
          if (
            e?.message?.includes(
              'ETELEGRAM: 400 Bad Request: message is not modified',
            )
          ) {
            console.log(
              '========== telegram bot consumer ========== message is not modified:',
              cmd,
            );
            return;
          }
          console.log(
            '🚀 ~ file: telegram-bot.consumer.ts:46 ~ TelegramBotConsumer ~ cmd handler error:',
            cmd,
            e,
          );
        });
    } else {
      console.log(
        '🚀 ~ file: telegram-bot.consumer.ts:46 ~ TelegramBotConsumer ~ cmd unknown callback:',
        cmd,
      );
    }
  }
}
