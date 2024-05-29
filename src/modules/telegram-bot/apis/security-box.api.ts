import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';
import process from 'process';

const getHost = () => {
  return `${process.env.SECURITY_BOX_HOST}/api/v1`;
};
const getGoogleToken = async () => {
  const googleAuth = new GoogleAuth();
  const client = await googleAuth.getClient();

  // Get the ID token.
  // Once you've obtained the ID token, you can use it to make an authenticated call
  // to the target audience..
  // @ts-ignore
  return await client.fetchIdToken(process.env.SECURITY_BOX_HOST);
};

export const createUserApi = async () => {
  const url = `${getHost()}/users`;
  if (process.env.APP_ENV == 'production') {
    const token = await getGoogleToken();
    return axios.post(
      url,
      {},
      { headers: { 'X-Serverless-Authorization': 'Bearer ' + token } },
    );
  }
  return axios.post(url);
};

export const getPrivateKeysSolanaApi = async (id: string, token: string) => {
  const url = `${getHost()}/users/${id}/wallets/private-keys`;

  if (process.env.APP_ENV == 'production') {
    const googleToken = await getGoogleToken();
    return axios.get(url, {
      params: {
        token,
      },
      headers: { 'X-Serverless-Authorization': 'Bearer ' + googleToken },
    });
  }
  return axios.get(url, {
    params: {
      token,
    },
  });
};

export const createWalletsSolanaApi = async (
  id: string,
  numberWallet: number,
) => {
  const url = `${getHost()}/solana/users/${id}/wallets`;
  if (process.env.APP_ENV == 'production') {
    const token = await getGoogleToken();
    return axios.post(
      url,
      { number_wallet: numberWallet },
      { headers: { 'X-Serverless-Authorization': 'Bearer ' + token } },
    );
  }
  return axios.post(url, { number_wallet: numberWallet });
};

export const importWalletSolanaApi = async (id: string, privateKey: string) => {
  const url = `${getHost()}/solana/users/${id}/wallets/import`;
  if (process.env.APP_ENV == 'production') {
    const token = await getGoogleToken();
    return axios.post(
      url,
      { private_key: privateKey },
      { headers: { 'X-Serverless-Authorization': 'Bearer ' + token } },
    );
  }
  return axios.post(url, { private_key: privateKey });
};

export const signTransactionSolanaApi = async (
  id: string,
  transactionData: any,
) => {
  const url = `${getHost()}/solana/users/${id}/wallets/sign-transaction`;
  if (process.env.APP_ENV == 'production') {
    const token = await getGoogleToken();
    return axios.post(url, transactionData, {
      headers: { 'X-Serverless-Authorization': 'Bearer ' + token },
    });
  }
  return axios.post(url, transactionData);
};

export const signAllTransactionSolanaApi = async (
  id: string,
  transactionData: any,
) => {
  const url = `${getHost()}/solana/users/${id}/wallets/sign-all-transaction`;
  if (process.env.APP_ENV == 'production') {
    const token = await getGoogleToken();
    return axios.post(url, transactionData, {
      headers: { 'X-Serverless-Authorization': 'Bearer ' + token },
    });
  }
  return axios.post(url, transactionData);
};
