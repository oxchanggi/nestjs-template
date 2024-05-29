import { registerAs } from '@nestjs/config';
import { BlockchainOptions } from '@/blockchain';

export const configBlockchain = registerAs(
  'blockchain',
  (): BlockchainOptions => ({
    mainnet: Boolean(process.env.APP_ENV == 'production'),
  }),
);
