import { ChatId } from 'node-telegram-bot-api';
import { Inject, Injectable } from '@nestjs/common';
import { TelegramBot } from '@/telegram-bot/telegram-bot';
import { Handler } from '@/telegram-bot/handlers/handler';
import { EParseMode, EUserAction } from '@/telegram-bot/constants';

@Injectable()
export class VerifySignatureCodeButtonHandler implements Handler {
  @Inject(TelegramBot)
  private readonly bot: TelegramBot;

  handler = async (data: { chatId: ChatId; telegramId: string }) => {
    const text = `Enter Referral Code: `;

    await this.bot.sendMessage(data.chatId, text, {
      parse_mode: EParseMode.HTML,
      disable_web_page_preview: true,
      reply_markup: { force_reply: true },
    });
    this.bot.setUserAction(
      data.chatId.toString(),
      EUserAction.INPUT_REF_CODE_STATUS,
    );
  };
}
