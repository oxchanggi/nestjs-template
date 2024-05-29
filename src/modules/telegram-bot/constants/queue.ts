export const QUEUE_NAME = {
  SEND_TRANSACTION: 'send_transaction',
  SEND_TRANSACTION_V2: 'send_transaction_v2',
  SIGN_TRANSACTION: 'sign_transaction',
  SIGN_TRANSACTION_V2: 'sign_transaction_v2',
  SOLANA_TRANSACTION: 'solana_transaction',
  BRIDGE: 'bridge',
  SWAP: 'swap',
  TELEGRAM_BOT: 'telegram_bot',
  TASK: 'task',
  TRADING: 'trading',
  PAYING: 'paying',
  ADMIN: 'admin',
};

export const QUEUE_PROCESSOR = {
  SEND_TRANSACTION: {
    SEND: 'SEND',
    WAIT: 'WAIT',
  },
  SEND_TRANSACTION_V2: {
    SEND: 'SEND',
    WAIT: 'WAIT',
    PERSIST: 'PERSIST',
  },
  SIGN_TRANSACTION: {
    SIGN: 'sign',
  },
  SIGN_TRANSACTION_V2: {
    SIGN: 'sign',
    SIGN_SEND: 'sign_send',
  },
  SOLANA_TRANSACTION: {
    SIGN_SEND: 'sign_send',
    WAIT: 'WAIT',
  },
  TELEGRAM_BOT: {
    POOLING_QUEUE: 'pooling_queue',
    SEND_MESSAGE: 'send_message',
    SEND_PAGE_MESSAGE: 'send_page_message',
    SEND_PHOTO_MESSAGE: 'send_photo_message',
    NEW_TOKENS: 'new_tokens',
  },
};
