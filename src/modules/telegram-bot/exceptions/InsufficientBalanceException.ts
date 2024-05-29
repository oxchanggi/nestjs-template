export class InsufficientBalanceException extends Error {
  balance: string;
  symbol: string;
  requiredBalance: string;

  constructor(
    symbol: string,
    balance: string,
    requiredBalance: string,
    message?: string,
  ) {
    super(message);
    this.balance = balance;
    this.symbol = symbol;
    this.requiredBalance = requiredBalance;
    this.name = 'InsufficientBalanceException';
  }
}
