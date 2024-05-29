import { EUserAction } from '../constants';
import {
  IWalletOrder,
  IWalletToken,
  Order,
  IWalletOrderDCABuy,
  WalletPosition,
  IWalletOrderDCASell,
} from '../constants/interface';

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

export type OrderWallet = {
  name?: string;
  status?: boolean;
  balance?: number;
  address?: string;
};

export type BuyOrderState = {
  wallets?: { [address: string]: OrderWallet };
  amount?: string;
  quote_amount?: string;
  price_impact?: string;
  contract_address?: string;
  submited?: boolean;
  slippage?: string;
  isMev?: boolean;
  token_info?: any;
  balances?: any;
};

export type LimitOrderState = {
  wallets?: { [address: string]: OrderWallet };
  amount?: string;
  amountPercent?: string;
  quote_amount?: string;
  price_impact?: string;
  contract_address?: string;
  submited?: boolean;
  token_info?: any;
  balances?: any;
  priceChange?: string;
  fixPrice?: string;
  expiredTime?: string;
  mode: 'percent' | 'value';
};

export interface AutoBuyDCAState {
  wallets?: { [address: string]: OrderWallet };
  amount?: string;
  quote_amount?: string;
  price_impact?: string;
  contract_address?: string;
  submited?: boolean;
  token_info?: any;
  balances?: any;
  intervalTime?: string;
  duration?: string;
  maxPrice?: string;
}

export interface AutoSellDCAState {
  wallets?: { [address: string]: OrderWallet };
  amountPercent?: string;
  quote_amount?: string;
  price_impact?: string;
  contract_address?: string;
  submited?: boolean;
  token_info?: any;
  balances?: any;
  intervalTime?: string;
  duration?: string;
  minPrice?: string;
}

export type SellOrderState = {
  wallets?: { [address: string]: OrderWallet };
  amountPercent?: string;
  submited?: boolean;
  amount?: number;
  slippage?: string;
  tokenIndexList?: number[];
  holdingTokens?: IWalletToken[];
};

export type AutoBuyCancelOrdersState = {
  orders?: IWalletOrder[];
};

export type AutoBuyDCACancelOrdersState = {
  orders?: IWalletOrderDCABuy[];
};

export type AutoSellDCACancelOrdersState = {
  orders?: IWalletOrderDCASell[];
};

export type WithdrawOrderState = {
  fromWallet?: string;
  toWallet?: string;
  toCustom?: string;
  submited?: boolean;
  amount?: number;
};

export type TransferTokenState = {
  fromWallet?: string;
  toWallet?: string;
  toCustom?: string;
  submited?: boolean;
  amountPercent?: number;
  amount?: number;
  tokenIndex?: number;
};

export type SellInTokenMonitor = {
  amountPercent?: number;
  muteToken?: boolean;
  muteAll?: boolean;
  position?: WalletPosition;
  isSubmitted?: boolean;
  isSubmittedMuteToken?: boolean;
  isSubmittedMuteAll?: boolean;
};

export type GlobalConfigState = {
  isMev?: boolean;
  wallets?: { [address: string]: OrderWallet };
  buyTokenAmount?: string;
  slippage?: string;
  sellTokenAmountPercent?: string;
};
