import { transferToken as suiTransferToken } from './sui/transferToken';

import type { RequestTransferToken } from './types';

export const transferToken = async (
  request: RequestTransferToken,
): Promise<string> => {
  switch (request.auth.network) {
    case 'sui:mainnet':
    case 'sui:devnet':
    case 'sui:testnet':
      return suiTransferToken(request);
    default:
      break;
  }
  throw new Error('not support network');
};
