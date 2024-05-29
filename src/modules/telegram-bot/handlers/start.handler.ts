import { ChatId } from 'node-telegram-bot-api';
import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { TelegramBot } from '@/telegram-bot/telegram-bot';
import _ from 'lodash';
import { Handler } from './handler';

@Injectable()
export class StartHandler implements Handler, OnApplicationBootstrap {
  @Inject(TelegramBot)
  private readonly bot: TelegramBot;

  async onApplicationBootstrap() {}

  handler = async (data: {
    chatId: ChatId;
    telegramId: string;
    firstName?: string;
    messageId: number;
    input?: string;
  }) => {};
}
