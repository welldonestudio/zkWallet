import { sendToken as sui } from './sui/sendToken';

import type { RequestTransferToken } from './types';

export const sendToken = async (
  request: RequestTransferToken,
): Promise<string> => {
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
