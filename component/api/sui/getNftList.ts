import { SuiClient } from '@mysten/sui.js/client';

import { getProviderUrl } from './utils/getProviderUrl';

import type { NftData, RequestNftList, ResponseNftList } from '../types';

export const getNftList = async (
  request: RequestNftList,
): Promise<ResponseNftList> => {
  try {
    let url = getProviderUrl(request.auth.network);
    const client = new SuiClient({ url });

    const objs = await client.getOwnedObjects({
      owner: request.address,
      filter: {
        MatchNone: [{ StructType: '0x2::coin::Coin' }],
      },
      options: {
        showDisplay: true,
      },
    });

    return {
      nextPage: objs.nextCursor || undefined,
      list: objs.data
        .filter((item) => item.data)
        .map(
          (item) =>
            ({
              address: item.data?.objectId as string,
              title: item.data?.display?.data?.name,
              desc: item.data?.display?.data?.description,
              img: item.data?.display?.data?.image_url,
              link:
                item.data?.display?.data?.link ||
                item.data?.display?.data?.project_url,
            }) as NftData,
        ),
    };
  } catch (error) {
    throw new Error(`${error}`);
  }
};
