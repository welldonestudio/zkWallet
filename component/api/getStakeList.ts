import { getStakeList as sui } from './sui/getStakeList';

import type { RequestStakeList, ResponseStake } from './types';

export const getStakeList = async (
  request: RequestStakeList,
): Promise<ResponseStake[]> => {
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
