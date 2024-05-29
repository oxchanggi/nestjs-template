import { TOKENS } from '@/blockchain/configs';
import _ from 'lodash';

export function sleep(ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export const tokenByAddress = (address, chainId: number) => {
  const tokens = TOKENS[chainId];
  if (!tokens) {
    throw new Error("Can't get token");
  }
  return _.keyBy(Object.values(tokens), 'address')[address];
};
