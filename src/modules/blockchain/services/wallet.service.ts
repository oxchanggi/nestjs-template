import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Keypair } from '@solana/web3.js';
import { decryptData, encryptData } from 'utils';
import bs58 from 'bs58';

@Global()
@Injectable()
export class WalletService {
  constructor(private readonly configService: ConfigService) {}

  createWallet() {
    const keypair = new Keypair();

    const secret =
      this.configService.get<string>('app.prefixSecret') +
      this.configService.get<string>('app.secretPk');

    const privateKey = bs58.encode(keypair.secretKey);

    const encryptedPrivateKey = encryptData(privateKey, secret);

    return {
      publicKey: keypair.publicKey.toString(),
      privateKey: encryptedPrivateKey,
    };
  }

  getPrivateKey(encryptedPrivateKey: string) {
    const secret =
      this.configService.get<string>('app.prefixSecret') +
      this.configService.get<string>('app.secretPk');
    const decryptedPrivateKey = decryptData(encryptedPrivateKey, secret);

    return bs58.decode(decryptedPrivateKey);
  }
}
