import { RequestTransferToken } from './types';
import { transferToken as suiTransferToken } from './sui/transferToken';

export const transferToken = async (
  request: RequestTransferToken,
): Promise<string> => {
  switch (request.wallet.network) {
    case 'sui:mainnet':
    case 'sui:devnet':
    case 'sui:testnet':
      return suiTransferToken(request);
    default:
      break;
  }
  throw new Error('not support network');
};
