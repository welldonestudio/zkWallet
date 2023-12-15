import { getStakes as sui } from './sui/getStakes';

import type { RequestGetStake, ResponseGetStake } from './types';

export const getStakes = async (
  request: RequestGetStake,
): Promise<ResponseGetStake[]> => {
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
