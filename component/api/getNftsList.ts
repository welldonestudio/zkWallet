import { getNftList as sui } from './sui/getNftList';

import type { RequestNftList } from './types';

export const getNftList = async (
  request: RequestNftList,
): Promise<void> => {
  switch (request.auth.network) {
    case 'sui:mainnet':
    case 'sui:devnet':
    case 'sui:testnet':
      sui(request);
      break;
    default:
      break;
  }
  // throw new Error('not support network');
};
