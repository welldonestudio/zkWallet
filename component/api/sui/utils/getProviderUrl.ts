import type { NETWORK } from '@/store/slice/config';

export const getProviderUrl = (network: NETWORK) => {
  switch (network) {
    case 'sui:mainnet':
      return 'https://fullnode.mainnet.sui.io';
    case 'sui:devnet':
      return 'https://fullnode.devnet.sui.io';
    case 'sui:testnet':
      return 'https://fullnode.testnet.sui.io';
    default:
      break;
  }
  throw new Error(`${network} is not supported`);
};
