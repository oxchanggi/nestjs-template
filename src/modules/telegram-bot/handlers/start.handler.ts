import { BlockchainService } from '@/telegram-bot/services';
import { ChatId } from 'node-telegram-bot-api';
import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { TelegramBot } from '@/telegram-bot/telegram-bot';
import { Handler } from './handler';
import { MainPage } from '../ui/pages/main.page';
import { UserService } from '@/database/services';
import { convertStringToNumber, currencyFormatter, toNumber } from '../utils';
import { PriceService } from '@/telegram-bot/services/price.service';
import { PositionService } from '../services/position.service';
import { EOrderType } from '@/database/constants/enum';
import _ from 'lodash';
import { EParseMode, EUserAction } from '../constants';
import { VerifySignatureCodePage } from '../ui/pages/verify-signature-code.page';

@Injectable()
export class StartHandler implements Handler, OnApplicationBootstrap {
  @Inject(TelegramBot)
  private readonly bot: TelegramBot;

  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(BlockchainService)
  private readonly blockchainService: BlockchainService;

  @Inject(PriceService)
  protected priceService: PriceService;

  @Inject(PositionService)
  private readonly positionService: PositionService;

  async onApplicationBootstrap() {}

  handler = async (data: {
    chatId: ChatId;
    telegramId: string;
    firstName?: string;
    messageId: number;
    input?: string;
  }) => {
    const { firstName, input, chatId } = data;
    const refCode = this.getRefCodeFromInput(input);

    const recentSearchState: { data: string[] } = await this.bot.getStateByKey(
      'recent_search',
      chatId,
    );

    const isExistRecentSearch =
      !_.isEmpty(recentSearchState) && recentSearchState?.data?.length > 0;

    if (!isExistRecentSearch) {
      await this.bot.setStateByKey(
        'recent_search',
        chatId,
        {
          data: [],
        },
        60 * 60 * 24 * 365,
      );
    }

    let walletAddress;
    //TODO: get info user
    let user = await this.userService.getUserByTelegramId(data.telegramId);
    const telegramUsername = firstName && firstName ? firstName : 'Soyboter';

    let newUser = false;

    if (!user) {
      newUser = true;
      // TODO: create a new user and solana wallet

      user = await this.userService.create({
        telegram_id: data.telegramId,
        telegram_username: telegramUsername,
      });

      walletAddress = await this.userService.createWallet(user.id);
    } else {
      const hasNoWallets = !user.wallets || user.wallets.length === 0;

      walletAddress = hasNoWallets
        ? await this.userService.createWallet(user.id)
        : user.wallets[0].address;
    }
    // const balance =
    //   await this.blockchainService.getSolanaBalance(walletAddress);

    user = await this.userService.getUserByTelegramId(data.telegramId);

    if (!user.referrer_id && !refCode) {
      const msg = new VerifySignatureCodePage().build({ firstName });

      await this.bot.sendPageMessage(chatId, msg);

      return;
    }

    if (refCode) {
      await this.enterRefCode(user.id, refCode);
    }
    let balances = [];

    if (!newUser) {
      balances = await Promise.all(
        user?.wallets
          ?.sort(
            (dt1, dt2) =>
              convertStringToNumber(dt1.name) - convertStringToNumber(dt2.name),
          )
          .map((wallet) =>
            this.blockchainService.getSolanaBalance(wallet.address),
          ) ?? [],
      );
    }

    const solPrice = await this.priceService.getSolPrice();

    let walletInfos: any[] = [];

    walletInfos = user?.wallets
      ?.sort(
        (dt1, dt2) =>
          convertStringToNumber(dt1.name) - convertStringToNumber(dt2.name),
      )
      .map((wallet, index) => {
        return {
          balance: currencyFormatter(toNumber(balances[index] || 0)),
          address: wallet.address,
          name: wallet.name,
          type: wallet.type,
          balanceUSD: currencyFormatter(
            toNumber(balances[index] || 0) * solPrice,
          ),
        };
      });

    await this.bot.sendPagePhoto(
      data.chatId,
      new MainPage(firstName, walletInfos).build(isExistRecentSearch),
    );
  };

  // ==================== internal ====================
  private enterRefCode = async (userId: string, refCode: string) => {
    try {
      const user = await this.userService.getUserById(userId);

      if (user.referrer_id) return;

      const existReferrees = await this.userService.userRepository.exists({
        where: {
          referrees: {
            id: user.id,
          },
        },
        relations: ['referrees'],
      });

      if (existReferrees) {
        console.log('user has some referrees');
        return;
      }

      const refUser = await this.userService.getUserByReferralCode(refCode);

      // ref code not found
      if (!refUser) {
        console.log('ref code not found');
        return;
      }

      // You can not enter your ref code
      if (refUser.id === user.id) {
        console.log('You can not enter your ref code');
        return;
      }

      await this.userService.update(userId, { referrer_id: refUser.id });
    } catch (error) {
      console.log('error in enter ref code', error);
    }
  };

  // input = /start 12341234
  // output = 12341234
  private getRefCodeFromInput = (input: string): string => {
    return input.split('/start ')[1];
  };
}
