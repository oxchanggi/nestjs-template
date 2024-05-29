export class MintedNftException extends Error {
  ethBalance: string;
  minGas: string;

  constructor(message?: string) {
    super(message);
    this.name = 'MintedNftException';
  }
}
