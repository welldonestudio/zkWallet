import { SuiClient } from '@mysten/sui.js/client';

import { getProviderUrl } from './utils/getProviderUrl';

import type { RequestNftList } from '../types';

export const getNftList = async (
  request: RequestNftList,
): Promise<void> => {
  try {
    let url = getProviderUrl(request.auth.network);
    const client = new SuiClient({ url });

    const objs = await client.getOwnedObjects({
      owner: request.address,
      filter: {
        MatchNone: [{ StructType: '0x2::coin::Coin' }],
      },
    });

    console.log(objs);
  } catch (error) {
    throw new Error(`${error}`);
  }
};
