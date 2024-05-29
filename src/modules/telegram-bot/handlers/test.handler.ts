import { Inject, Injectable } from '@nestjs/common';
import { Handler } from './handler';
import { ChatId } from 'node-telegram-bot-api';
import { UserService } from '@/database/services';
import { TokenValueMonitorHandler } from './token-value-monitor/token-value-monitor.handler';
import { PositionService } from '../services/position.service';
import { PositionOverviewOptionsPage } from '../ui/pages/position/position-overview-options.page';
import { TelegramBot } from '../telegram-bot';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUE_NAME, QUEUE_PROCESSOR } from '../constants/queue';
import { LimitOrderService } from '../services/limit-orders.service';
import { OrderHistoryPage } from '../ui/pages/order-history/order-history.page';
import { DCAOrderTxResultPage } from '../ui/pages/dca-order/dca-order-tx-result';
import { AutoBuyDCAState } from '../types';
import { parseTime } from '../utils/time';

@Injectable()
export class TestHandler implements Handler {
  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(TokenValueMonitorHandler)
  private readonly tokenValueMonitorHandler: TokenValueMonitorHandler;

  @Inject(PositionService)
  private readonly positionService: PositionService;

  @Inject(TelegramBot)
  private readonly bot: TelegramBot;

  @Inject(LimitOrderService)
  private readonly limitOrderService: LimitOrderService;

  constructor(
    @InjectQueue(QUEUE_NAME.TELEGRAM_BOT) private telegramBotQueue: Queue,
  ) {}

  handler = async (data: {
    chatId: ChatId;
    telegramId: string;
    firstName: string;
    messageId: number;
  }) => {
    const keyState = 'auto-buy-dca';

    let autoBuyDCAState = await this.bot.getStateByKey<AutoBuyDCAState>(
      keyState,
      `1152070136:6829`,
    );

    const wallet = {
      name: 'w1',
      address: 'address',
    };

    const page2 = new DCAOrderTxResultPage().build([
      {
        walletName: wallet.name,
        walletAddress: wallet.address,
        amount: autoBuyDCAState.amount,
        quoteName: 'SOL',
        baseName: autoBuyDCAState?.token_info?.token_symbol,
        interval: parseTime(autoBuyDCAState.intervalTime),
        duration: parseTime(autoBuyDCAState.duration),
        price: 0,
        tx: null,
      },
    ]);

    await this.bot.sendPageMessage(data.chatId, page2);

    const orders = await this.limitOrderService.getOrderHistoryWithTelegramId(
      data.telegramId,
      'sell',
    );

    const page1 = new OrderHistoryPage().build({
      orders,
      solPrice: 100,
      type: 'buy',
    });

    await this.bot.sendPageMessage(data.chatId, page1);

    // let start = Date.now();
    // const rs = this.telegramBotQueue.add(
    //   QUEUE_PROCESSOR.TELEGRAM_BOT.NEW_TOKENS,
    //   {
    //     tokenAddresses: ['Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'],
    //   },
    //   {
    //     removeOnComplete: 20,
    //     removeOnFail: true,
    //   },
    // );
    // let end = Date.now();
    // console.log(data);
    // const ps = await this.positionService.getAllPositionsByTelegramId(
    //   data.telegramId,
    // );
    // const page = new PositionOverviewOptionsPage().build({
    //   positions: [ps.find((p) => p.token?.token_stat?.circulating_supply > 0)],
    //   slippage: 0.5,
    //   wallets: [],
    // });
    // await this.bot.sendPageMessage(data.chatId, page);
    // this.tokenValueMonitorHandler.handler({
    //   telegramId: '1152070136',
    //   tokenAddress: 'GTH3wG3NErjwcf7VGCoXEXkgXSHvYhx5gtATeeM5JAS1',
    // });
  };
}
