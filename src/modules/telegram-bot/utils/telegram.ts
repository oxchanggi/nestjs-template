import { CallbackQuery, Message } from 'node-telegram-bot-api';

export const parserMessageTelegram = (msg: Message) => ({
  messageId: msg.message_id,
  chatId: msg.chat.id,
  telegramId: msg.from.id,
  message_thread_id: msg.message_thread_id,
  firstName: msg.from.first_name,
  username: msg.from.username,
  text: msg.text,
  isInputMessage: !msg?.entities,
  reply_to_message_id: msg?.reply_to_message?.message_id,
  chatType: msg.chat.type,
});

export function formatString(format: string, ...args: any[]): string {
  return format.replace(/{(\d+)}/g, (match, index) => {
    const value = args[index];
    return value !== undefined ? value : match;
  });
}

export const parserCallbackMessageTelegram = (query: CallbackQuery) => ({
  messageId: query.message.message_id,
  chatId: query.message.chat.id,
  telegramId: query.from.id,
  firstName: query.from.first_name,
  queryId: query.id,
});
