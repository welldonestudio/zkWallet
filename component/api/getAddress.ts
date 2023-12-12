import { jwtToAddress } from '@mysten/zklogin';
import { RequestGetAddress } from './types';
import { utils } from './utils';

export const getAddress = async (
  request: RequestGetAddress,
): Promise<string> => {
  switch (request.chain) {
    case 'sui:mainnet':
    case 'sui:mainnet':
      return jwtToAddress(request.jwt, BigInt(utils.str2Hash(request.path)));
    default:
      break;
  }
  throw new Error('not support chain');
};
