import { stake as sui } from './sui/stake';

import type { RequestSuiStake } from './types';

export const stake = async (request: RequestSuiStake): Promise<string> => {
  switch (request.auth.network) {
    case 'sui:mainnet':
    case 'sui:devnet':
    case 'sui:testnet':
      return sui(request);
    default:
      break;
  }
  throw new Error('not support network');
};
