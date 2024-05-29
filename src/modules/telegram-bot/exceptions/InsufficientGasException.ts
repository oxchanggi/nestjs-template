export class InsufficientGasException extends Error {
  ethBalance: string;
  minGas: string;

  constructor(ethBalance: string, minGas: string, message?: string) {
    super(message);
    this.ethBalance = ethBalance;
    this.minGas = minGas;
    this.name = 'InsufficientGasException';
  }
}
