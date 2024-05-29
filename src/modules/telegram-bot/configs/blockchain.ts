import { registerAs } from '@nestjs/config';
import { BlockchainOptions } from '@/blockchain';

export const configBlockchain = registerAs(
  'blockchain',
  (): BlockchainOptions => ({
    mainnet: Boolean(Number(process.env.IS_MAINNET || 0) == 1),
    contract_address: process.env.CONTRACT_ADDRESS,
  }),
);
