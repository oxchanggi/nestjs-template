import { EWalletType, buildPhotoOptions } from '@/telegram-bot/constants';
import { PhotoResponse } from '@/telegram-bot/types';
import { createMenuLabel, insertNewlines } from '@/telegram-bot/utils';
import { PhotoPage } from './page';
import { ButtonText } from 'lang/config/en/button';

export class MainPage implements PhotoPage {
  constructor(
    private readonly firstName: string,
    private readonly walletInfos: any[],
  ) {}

  build(): PhotoResponse {
    const mapBalances = this.walletInfos?.map((item) => {
      return `<b><a href="https://solscan.io/account/${
        item.address
      }">🔸 Wallet - ${item.name} ${
        item.type == EWalletType.AutoCreate ? '🛠️' : '📥'
      }</a></b>\n<code>${item.balance}</code> SOL | $<code>${
        item.balanceUSD
      }</code>\n<code>${item.address ? item.address : ''}</code>\n`;
    });

    const joinedWallet = insertNewlines(mapBalances, 1).join('');

    const text = `Welcome to <b>Bot</b>, ${this.firstName}\n<b>The Fastest Sniper Bot on Solana.\nPowered by <a>$SOY</a></b>\n\nThis is your newly created Bot wallet.\nFund SOL and start trading!\n\nYou can explore more at <a href="https://t.me/verifySoybot"><b>Bot community</b></a>\n\n<b>=== Your Solana Wallets ===</b>\n${joinedWallet}`;

    const menu = buildPhotoOptions(
      [[createMenuLabel(ButtonText.main.title)]],
      text,
    );

    return { photo: null, menu };
  }
}
