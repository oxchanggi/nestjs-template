import { EUserAction } from '@/telegram-bot/constants';
import { TelegramBot } from '@/telegram-bot/telegram-bot';
import { Inject, Injectable } from '@nestjs/common';
import { ChatId } from 'node-telegram-bot-api';
import { Handler } from './handler';

@Injectable()
export class UserInputHandler implements Handler {
  @Inject(TelegramBot)
  private readonly bot: TelegramBot;

  handler = async (data: {
    chatId: ChatId;
    telegramId: string;
    messageId: number;
    text: string;
    reply_to_message_id: number;
  }) => {
    try {
      const state = await this.bot.getState(data.chatId.toString());

      switch (state.user_action) {
        default:
          await this.bot.setState(data.chatId.toString(), {
            ...state,
            user_action: EUserAction.DEFAULT,
          });

          return;
      }
    } catch (error) {
      console.error(error);
    }
  };
}
