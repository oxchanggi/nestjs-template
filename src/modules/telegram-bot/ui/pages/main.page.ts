import { EWalletType, buildPhotoOptions } from '@/telegram-bot/constants';
import { PhotoResponse } from '@/telegram-bot/types';
import { createMenuLabel, insertNewlines } from '@/telegram-bot/utils';
import * as fs from 'fs';
import { ButtonText } from 'lang/soybot/en/button';
import path from 'path';
import { PhotoPage } from './page';

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

    const text = `Welcome to <b>SoyBot</b>, ${this.firstName}\n<b>The Fastest Sniper Bot on Solana.\nPowered by <a>$SOY</a></b>\n\nThis is your newly created SoyBot wallet.\nFund SOL and start trading!\n\nYou can explore more at <a href="https://t.me/verifySoybot"><b>SoyBot community</b></a>\n\n<b>=== Your Solana Wallets ===</b>\n${joinedWallet}`;

    const imageFilePath = path.join(__dirname, '../../../../images/soybot.jpg');
    const photo = fs.readFileSync(imageFilePath);

    const menu = buildPhotoOptions(
      [[createMenuLabel(ButtonText.main.title)]],
      text,
    );

    return { photo, menu };
  }
}
