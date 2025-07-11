import {
  COMMAND_KEYS,
  EParseMode,
  EUserAction,
  EXPIRED_ORDER_SECOND,
  GLOBAL_STATE,
  MAX_TIME_STATE_OUT_DATE,
  USER_INPUT,
} from '@/telegram-bot/constants';
import { Global, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TelegramBotApi, {
  ChatId,
  EditMessageTextOptions,
  SendMessageOptions,
} from 'node-telegram-bot-api';
import {
  getRandomNumber,
  parseCommand,
  parserCallbackMessageTelegram,
  parserMessageTelegram,
} from './utils';
import {
  GlobalConfigState,
  Menu,
  PageResponse,
  PhotoResponse,
  TelegramBotState,
} from './types';
import Redis from 'ioredis';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUE_NAME, QUEUE_PROCESSOR } from './constants/queue';
import { Handler } from './handlers/handler';

// await this.bot.editMessagePage(page2.text, {
//   chat_id: chatId,
//   message_id: message_id,
//   parse_mode: 'HTML',
//   reply_markup: page2.menu as any,
//   disable_web_page_preview: true,
// });

@Injectable()
@Global()
export class TelegramBot {
  [x: string]: any;
  public telegramIdStatus: Record<string, number> = {};

  public bot: TelegramBotApi;

  @Inject('TELEGRAM_BOT_STATE')
  private botStateStore: Redis;

  private state: Record<string, TelegramBotState>;

  public handlers: Record<string, Handler>;

  constructor(
    private readonly configService: ConfigService,
    @InjectQueue(QUEUE_NAME.TELEGRAM_BOT) private telegramBotQueue: Queue,
  ) {
    const token = this.configService.get<string>('telegram.token');
    const isQueue = Boolean(Number(process.env.IS_QUEUE || 0));
    if (isQueue) {
      const isBot = Boolean(Number(process.env.IS_BOT || 0));
      if (isBot) {
        console.log('polling', true);
        this.bot = new TelegramBotApi(token, { polling: true });
      } else {
        console.log('polling', false);
        this.bot = new TelegramBotApi(token, { polling: false });
      }
    } else {
      console.log('polling', true);
      this.bot = new TelegramBotApi(token, { polling: true });
    }
    this.state = {};
    this.state = {};
  }

  async pinMessage(chatId: ChatId, messageId: number) {
    await this.bot.pinChatMessage(chatId, messageId);
  }

  async sendAnimatedEmoji(
    chatId: string,
    emojiUrl: string,
    caption: string,
    message_thread_id?: number,
  ) {
    try {
      await this.bot.sendMessage(chatId, caption, {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        message_thread_id,
      });
    } catch (error) {
      console.log('🚀 ~ file: telegram-bot.ts:101 ~ error:', error);
    }
  }

  async sendOnlyAnimatedEmojiWithDelay(
    chatId: string,
    emojiUrl: string,
    message_thread_id?: number,
  ) {
    try {
      setTimeout(
        () => {
          this.bot.sendDocument(chatId, emojiUrl, {
            parse_mode: 'HTML',
            message_thread_id,
          });
        },
        getRandomNumber(300, 700),
      );
    } catch (error) {
      console.log(
        '🚀 ~ file: telegram-bot.ts:63 ~ TelegramBot ~ error:',
        error,
      );
    }
  }

  async setUserAction(chatId: string, userAction: EUserAction) {
    const currState = (await this.botStateStore.hgetall(
      'telegram_bot_state:chat:' + chatId,
    )) as any;
    this.state[chatId] = {
      ...currState,
      user_action: userAction,
    };
    await this.botStateStore.hset(
      'telegram_bot_state:chat:' + chatId,
      this.state[chatId],
    );
  }

  async setState(telegramId: string, state: TelegramBotState) {
    const storageState = await this.getState(telegramId);
    state.updated_at = Date.now();
    this.state[telegramId] = { ...storageState, ...state };
    await this.botStateStore.hset(
      'telegram_bot_state:chat:' + telegramId,
      state,
    );
  }

  async getState(telegramId: string, isNow = true): Promise<TelegramBotState> {
    const state = this.state[telegramId];
    if (
      !state ||
      state.updated_at + MAX_TIME_STATE_OUT_DATE < Date.now() ||
      isNow
    ) {
      this.state[telegramId] = (await this.botStateStore.hgetall(
        'telegram_bot_state:chat:' + telegramId,
      )) as any;
    }

    return this.state[telegramId];
  }

  async sendMessage(
    chatId: ChatId,
    text: string,
    options?: SendMessageOptions,
  ) {
    try {
      return this.bot.sendMessage(chatId, text, options);
    } catch (error) {
      console.log('🚀 ~ file: telegram-bot.ts:89 ~ error:', error);
    }
  }

  async sendPageMessage(chatId: ChatId, data: PageResponse) {
    try {
      return this.bot.sendMessage(chatId, data.text, data.menu);
    } catch (error) {
      console.log('🚀 ~ file: telegram-bot.ts:97 ~ error:', error);
    }
  }

  async sendPagePhoto(chatId: ChatId, data: PhotoResponse) {
    try {
      return this.bot.sendPhoto(chatId, data.photo, data.menu);
    } catch (error) {
      console.log('🚀 ~ file: telegram-bot.ts:105 ~ error:', error);
    }
  }

  async editMessageText(text: string, chat_id: ChatId, message_id: number) {
    try {
      await this.bot.editMessageText(text, {
        chat_id,
        message_id,
        parse_mode: EParseMode.HTML,
        disable_web_page_preview: true,
      });
    } catch (error) {
      console.log('🚀 ~ file: telegram-bot.ts:113 ~ error:', error);
    }
  }

  async editMessagePage(text: string, options?: EditMessageTextOptions) {
    try {
      await this.bot.editMessageText(text, options);
    } catch (error) {
      console.log('🚀 ~ file: telegram-bot.ts:222 ~ error: bad request');
    }
  }

  async editMessageReplyMarkup(
    newButton: {
      inline_keyboard: Menu[][];
    },
    chat_id: ChatId,
    message_id: number,
  ) {
    try {
      await this.bot.editMessageReplyMarkup(newButton, {
        chat_id,
        message_id,
      });
    } catch (error) {
      if (error.message.includes('message is not modified:')) {
        console.log('message is not modified');
        return;
      }
      console.log('🚀 ~ file: telegram-bot.ts:119 ~ error:', error);
    }
  }

  async deleteMessage(chatId: ChatId, messageId: number, seconds = 0) {
    const timeout = setTimeout(async () => {
      try {
        await this.bot.deleteMessage(chatId, messageId);
      } catch (error) {
        console.log(
          '🚀 ~ file: telegram-bot.ts:131 ~ TelegramBot ~ timeout ~ error:',
          error,
        );
      }
      clearTimeout(timeout);
    }, seconds * 1000);
  }

  async setStateByKey<T>(
    key: string,
    chatId: string | number,
    state: T,
    expired?: number,
  ) {
    try {
      const _state = {};
      Object.keys(state).forEach((_key) => {
        if (state[_key] && Object.keys(state[_key]).length) {
          _state[_key] = JSON.stringify(state[_key]);
        } else {
          _state[_key] = state[_key];
        }
      });
      await this.botStateStore.hset(
        `telegram_bot_state:${key}:${chatId}`,
        _state,
      );
      await this.botStateStore.expireat(
        `telegram_bot_state:${key}:${chatId}`,
        Math.round(Date.now() / 1000) + (expired || EXPIRED_ORDER_SECOND),
      );
    } catch (err) {
      console.log('🐞 set state by key', err);
    }
  }

  async getStateByKey<T>(
    key: string,
    chatId: string | number,
    messageId: string | number = '',
  ): Promise<T> {
    const _tmp = (await this.botStateStore.hgetall(
      `telegram_bot_state:${key}:${chatId}${messageId ? ':' + messageId : ''}`,
    )) as any;
    const res = {};
    Object.keys(_tmp).forEach((_key) => {
      try {
        res[_key] = JSON.parse(_tmp[_key]);
      } catch (error) {
        res[_key] = _tmp[_key];
      }
    });
    return res as T;
  }

  async getGlobalConfigState(chatId: string | number) {
    return this.getStateByKey<GlobalConfigState>(GLOBAL_STATE, chatId);
  }

  async setGlobalConfigState(
    chatId: string | number,
    state: GlobalConfigState,
  ) {
    return this.setStateByKey(GLOBAL_STATE, chatId, state, 60 * 60 * 24 * 365);
  }

  setupStartCommand() {
    const cmd = COMMAND_KEYS.START;
    this.bot.onText(/\/start/, (msg, match) => {
      this.addCommandToQueue(
        cmd,
        { ...parserMessageTelegram(msg), input: match.input },
        {},
      );
    });
  }

  private setupTestCommand(callback: any) {
    this.bot.onText(/\/test/, (msg) => {
      callback(parserMessageTelegram(msg));
    });
  }

  setupMenuCallback(callback: any) {
    this.bot.on('callback_query', (query) => {
      const { data: action } = query;
      const data = parserCallbackMessageTelegram(query);
      const chatId = data.chatId.toString();
      if (this.state[chatId]?.language_code != query.from?.language_code) {
        this.setState(data.chatId.toString(), {
          language_code: query.from.language_code,
        }).then();
      }
      callback(action, data);
    });
  }

  userReply(callback: any) {
    this.bot.on('message', (msg) => {
      callback(parserMessageTelegram(msg));
    });
  }

  registerHandlers(handlers: Record<string, Handler>) {
    this.handlers = handlers;
  }

  addCommandToQueue = async (cmd: string, params: any, data: any) => {
    this.telegramBotQueue.add(
      QUEUE_PROCESSOR.TELEGRAM_BOT.POOLING_QUEUE,
      {
        cmd: cmd,
        params,
        data,
      },
      {
        removeOnComplete: 20,
        removeOnFail: true,
      },
    );
  };

  async start() {
    const isQueue = Boolean(Number(process.env.IS_QUEUE || 0));
    const isBot = Boolean(Number(process.env.IS_BOT || 0));
    if (isQueue && !isBot) return;

    const testHandler = this.handlers[COMMAND_KEYS.TEST];

    this.setupStartCommand();

    this.userReply((msg) => {
      return this.addCommandToQueue(USER_INPUT, {}, msg);
    });

    if (testHandler) {
      this.setupTestCommand(testHandler.handler);
    }

    this.setupMenuCallback(async (cmd, data) => {
      const { cmd: _cmd, params } = parseCommand(cmd);
      return this.addCommandToQueue(_cmd, params, data);
    });
  }
}
