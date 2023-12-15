import { SuiClient } from '@mysten/sui.js/client';

import { getProviderUrl } from './utils/getProviderUrl';

import type { RequestGetStake, ResponseGetStake } from '../types';

export const getStakes = async (
  request: RequestGetStake,
): Promise<ResponseGetStake[]> => {
  try {
    let url = getProviderUrl(request.auth.network);
    const client = new SuiClient({ url });

    const res = await client.getStakes({
      owner: request.address,
    });
    console.log(res);
    const staking: ResponseGetStake[] = [];
    /*
    res.forEach((item) =>
    item.stakes[0].
      staking.push({
        validatorAddress: item.validatorAddress,
        stakingPool: item.stakingPool,
        value: item.totalBalance,
        locked: item.lockedBalance,
      }),
    );
    */
    return staking;
  } catch (error) {
    throw new Error(`${error}`);
  }
};
