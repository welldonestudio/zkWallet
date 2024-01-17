import { getNftList as sui } from './sui/getNftList';

import type { RequestNftList, ResponseNftList } from './types';

export const getNftList = async (
  request: RequestNftList,
): Promise<ResponseNftList> => {
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
