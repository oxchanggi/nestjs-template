export class FailedBlockchainException extends Error {
  txHash: string;

  constructor(txHash: string, message?: string) {
    super(message);
    this.txHash = txHash;
    this.name = 'FailedBlockchainException';
  }
}
