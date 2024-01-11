import { getValidators as sui } from './sui/getValidators';

import type { RequestValidator, ResponseValidator } from './types';

export const getValidators = async (
  request: RequestValidator,
): Promise<ResponseValidator[]> => {
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
