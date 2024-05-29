import { EUserAction } from '../constants';

export type TelegramBotState = {
  language_code?: string;
  updated_at?: number;
  buy_order_message_id?: number;
  auto_buy_dca_message_id?: number;
  auto_buy_limit_message_id?: number;
  auto_buy_message_id?: number;
  auto_buy_dca_cancel_orders_message_id?: number;
  auto_sell_dca_cancel_orders_message_id?: number;
  transfer_sol_message_id?: number;
  transfer_token_message_id?: number;
  sell_order_message_id?: number;
  sell_order_list_message_id?: number;
  auto_sell_message_id?: number;
  auto_sell_limit_message_id?: number;
  auto_sell_dca_message_id?: number;
  reply_list_message_id?: number;
  user_action?: EUserAction;
  wallet_name?: string;
  chain_id?: number;
  orderSymbol?: string;
  isBuy?: string;
  data?: any;
};

export type GlobalConfigState = {
  isMev?: boolean;
  buyTokenAmount?: string;
  slippage?: string;
  sellTokenAmountPercent?: string;
};
