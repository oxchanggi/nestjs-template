export const MAX_TIME_STATE_OUT_DATE = 60 * 1000; //1 minute

export const MAX_TIME_PRICE_OUT_DATE = 10 * 1000; //1 minute
export const MAX_TIME_WEI_OUT_DATE = 10 * 1000; //1 minute

export const MAX_USER_WALLET = 3;
export const EXPIRED_ORDER_SECOND = 60 * 60 * 12;
export const EXPIRED_SUBMITTED_ORDER_SECOND = 3;

export const TELEGRAM_BOT_STATE = 'telegram_bot_state';

export const USER_INPUT = 'user_input';

export const BASE_DEX_SCREENER_URL = 'https://dexscreener.com/solana';
export const REVENUE_WALLET = 'H1kbqGxvcMeueH7wXAMQ3t1RG7yrQUiWNiGExSiAMajX';
export const TRANSACTION_FEE = 1;

export const SOYBOT_HANDLE =
  process.env.APP_ENV == 'production' ? 'soy_sniperbot' : 'soy_devbot';

export const GLOBAL_STATE = 'global_state';
