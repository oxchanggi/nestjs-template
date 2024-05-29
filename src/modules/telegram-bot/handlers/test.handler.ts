import { Inject, Injectable } from '@nestjs/common';
import { ChatId } from 'node-telegram-bot-api';
import { TelegramBot } from '../telegram-bot';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUE_NAME, QUEUE_PROCESSOR } from '../constants/queue';
import { AutoBuyDCAState } from '../types';
import { parseTime } from '../utils/time';
import { Handler } from './handler';

@Injectable()
export class TestHandler implements Handler {
  @Inject(TelegramBot)
  private readonly bot: TelegramBot;

  constructor(
    @InjectQueue(QUEUE_NAME.TELEGRAM_BOT) private telegramBotQueue: Queue,
  ) {}

  handler = async (data: {
    chatId: ChatId;
    telegramId: string;
    firstName: string;
    messageId: number;
  }) => {};
}
