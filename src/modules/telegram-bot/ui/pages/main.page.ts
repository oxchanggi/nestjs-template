import {
  COMMAND_KEYS,
  EWalletType,
  buildPhotoOptions,
} from '@/telegram-bot/constants';
import { PhotoResponse } from '@/telegram-bot/types';
import {
  buildCommand,
  createMenuButton,
  createMenuLabel,
  insertNewlines,
} from '@/telegram-bot/utils';
import * as fs from 'fs';
import { ButtonText } from 'lang/soybot/en/button';
import path from 'path';
import { PhotoPage } from './page';

export class MainPage implements PhotoPage {
  constructor(
    private readonly firstName: string,
    private readonly walletInfos: any[],
  ) {}

  build(isExistPosition?: boolean): PhotoResponse {
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
      [
        [createMenuLabel(ButtonText.main.title)],
        [
          createMenuButton(
            ButtonText.main.buy,
            isExistPosition
              ? COMMAND_KEYS.RECENT_SEARCH
              : COMMAND_KEYS.BUY_CONTRACT_CUSTOM,
          ),
          createMenuButton(ButtonText.main.sell, COMMAND_KEYS.SELL),
        ],

        [
          createMenuButton(
            ButtonText.main.autoBuy,
            COMMAND_KEYS.AUTO_BUY_OPTIONS,
          ),
          createMenuButton(
            ButtonText.main.autoSell,
            COMMAND_KEYS.AUTO_SELL_OPTIONS,
          ),
        ],
        [
          createMenuButton(
            ButtonText.main.bridgeToSol,
            COMMAND_KEYS.COMING_SOON,
          ),
          createMenuButton(ButtonText.main.snipers, COMMAND_KEYS.COMING_SOON),
        ],
        [
          createMenuButton(
            ButtonText.main.wallet,
            buildCommand(COMMAND_KEYS.WALLET, {}),
          ),
          createMenuButton(ButtonText.main.settings, COMMAND_KEYS.SETTINGS),
        ],
        [
          createMenuButton(
            ButtonText.main.watchlist,
            COMMAND_KEYS.WATCHLIST_OPTIONS,
          ),

          createMenuButton(
            ButtonText.main.tokenAlerts,
            undefined,
            'https://t.me/SoyBotTokenAlerts',
          ),
        ],
      ],
      text,
    );

    return { photo, menu };
  }
}
