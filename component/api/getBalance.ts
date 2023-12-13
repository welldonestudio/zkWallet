import { RequestGetBalance, ResponseBalnce } from './types';
import { getBalance as suiBalance } from './sui/getBalance';

export const getBalance = async (
  request: RequestGetBalance,
): Promise<ResponseBalnce[]> => {
  switch (request.wallet.network) {
    case 'sui:mainnet':
    case 'sui:devnet':
    case 'sui:testnet':
      return suiBalance(request);
    default:
      break;
  }
  throw new Error('not support network');
};
