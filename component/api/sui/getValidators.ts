import { SuiClient } from '@mysten/sui.js/client';

import { getProviderUrl } from './utils/getProviderUrl';

import type { RequestValidator, ResponseValidator } from '../types';

export const getValidators = async (
  request: RequestValidator,
): Promise<ResponseValidator[]> => {
  try {
    let url = getProviderUrl(request.auth.network);
    const client = new SuiClient({ url });

    const { apys } = await client.getValidatorsApy();

    return apys.map(
      (item) =>
        ({ name: item.address, ...item }) as unknown as ResponseValidator,
    );
  } catch (error) {
    throw new Error(`${error}`);
  }
};
