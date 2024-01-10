import { SuiClient } from '@mysten/sui.js/client';

import { getProviderUrl } from './utils/getProviderUrl';

import type { RequestGetStake, ResponseStake } from '../types';

export const getStakes = async (
  request: RequestGetStake,
): Promise<ResponseStake[]> => {
  try {
    let url = getProviderUrl(request.auth.network);
    const client = new SuiClient({ url });

    const res = await client.getStakes({
      owner: request.address,
    });

    const staking: ResponseStake[] = [];
    console.log(1, res);
    res.forEach((item) =>
      staking.push({
        validator: {
          name: item.validatorAddress,
          address: item.validatorAddress,
        },
        stakes: item.stakes.map((stake) => ({
          id: stake.stakedSuiId,
          status:
            stake.status === 'Active'
              ? 'active'
              : stake.status === 'Pending'
                ? 'pending'
                : 'unstaked',
          reward: (stake as any).estimatedReward || '',
          amount: stake.principal,
          activeEpoch: stake.stakeActiveEpoch,
          requestEpoch: stake.stakeRequestEpoch,
        })),
      }),
    );
    return staking;
  } catch (error) {
    throw new Error(`${error}`);
  }
};
