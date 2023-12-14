import { getBalance as suiBalance } from './sui/getBalance';

import type { RequestGetBalance, ResponseBalnce } from './types';

export const getBalance = async (
  request: RequestGetBalance,
): Promise<ResponseBalnce[]> => {
  switch (request.auth.network) {
    case 'sui:mainnet':
    case 'sui:devnet':
    case 'sui:testnet':
      return suiBalance(request);
    default:
      break;
  }
  throw new Error('not support network');
};
