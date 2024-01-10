import { SuiClient } from '@mysten/sui.js/client';

import { getProviderUrl } from './utils/getProviderUrl';
import { utils } from '../utils';

import type { RequestGetBalance, ResponseBalnce } from '../types';

export const getBalance = async (
  request: RequestGetBalance,
): Promise<ResponseBalnce[]> => {
  try {
    let url = getProviderUrl(request.auth.network);
    const client = new SuiClient({ url });

    const res = await client.getAllBalances({
      owner: request.address,
    });
    const balances: ResponseBalnce[] = [];
    res.forEach((item) =>
      balances.push({
        name: item.coinType === '0x2::sui::SUI' ? 'SUI' : item.coinType,
        type: item.coinType,
        value: item.totalBalance,
        fValue:
          item.coinType === '0x2::sui::SUI'
            ? utils.formatUnit(item.totalBalance, 6)
            : item.totalBalance,
        locked: item.lockedBalance,
      }),
    );
    return balances;
  } catch (error) {
    throw new Error(`${error}`);
  }
};
