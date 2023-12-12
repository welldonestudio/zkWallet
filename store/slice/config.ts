export type CHAIN = 'sui:mainnet' | 'sui:devnet' | 'sui:testnet';
export type CRYPTO = 'Ed25519';
export type PROVIDER =
  | 'google'
  | 'facebook'
  | 'twitch'
  | 'slack'
  | 'kakao'
  | 'apple';

export const CLIENT_ID: { [key: string]: string } = {
  google: '603276468327',
};
