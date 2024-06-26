export type NETWORK = 'sui:mainnet' | 'sui:devnet' | 'sui:testnet';
export type TYPE = 'extension' | 'ledger';
export type CRYPTO = 'ed25519';
export type PROVIDER =
  | 'google'
  | 'facebook'
  | 'twitch'
  | 'slack'
  | 'kakao'
  | 'apple';

export const CLIENT_ID: { [key: string]: string } = {
  google:
    '603276468327-avmo3q7bt8kgvi1ru4k4p0anuobbd5p4.apps.googleusercontent.com',
};

export const ZKPATH_PREFIX = 'zkpath';
export const MAX_EPOCH_DURATION = 100;
export const DEFAULT_NETWORK: NETWORK = 'sui:devnet';
export const CURRENCY_UNIT = 'SUI';
export const REDIRECT_AUTH_URL = 'https://zkwallet.welldonestudio.io/signup';

export const getZkPath = (network: string, index: number): string => {
  return `${ZKPATH_PREFIX}:${network}:${index}`;
};
