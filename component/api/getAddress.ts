import { jwtToAddress } from '@mysten/zklogin';

import { utils } from './utils';

import type { RequestGetAddress } from './types';

export const getAddress = async (
  request: RequestGetAddress,
): Promise<string> => {
  switch (request.network) {
    case 'sui:mainnet':
    case 'sui:devnet':
    case 'sui:testnet':
      return jwtToAddress(
        request.jwt,
        BigInt(utils.str2Hash(request.path, 16)),
      );
    default:
      break;
  }
  throw new Error('not support network');
};
