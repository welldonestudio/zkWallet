import { unStake as sui } from './sui/unStake';

import type { RequestSuiUnStake } from './types';

export const unStake = async (request: RequestSuiUnStake): Promise<string> => {
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
