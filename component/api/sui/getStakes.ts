import { SuiClient } from '@mysten/sui.js/client';

import { getProviderUrl } from './utils/getProviderUrl';

import type { RequestGetStake, ResponseStake } from '../types';

export const getStakes = async (
  request: RequestGetStake,
): Promise<ResponseStake[]> => {
  try {
    let url = getProviderUrl(request.auth.network);
    const client = new SuiClient({ url });

    const apys = await client.getValidatorsApy();
    console.log(111, apys);

    const stakes = await client.getStakes({
      owner: request.address,
    });

    const staking: ResponseStake[] = [];
    stakes.forEach((item) => {
      let totalAmount = BigInt(0);
      let estimatedReward = BigInt(0);

      item.stakes.forEach((stake) => {
        totalAmount = totalAmount + BigInt(stake.principal);
        estimatedReward =
          estimatedReward + BigInt((stake as any).estimatedReward || '0');
      });

      staking.push({
        validator: {
          name: item.validatorAddress,
          address: item.validatorAddress,
          totalAmount: totalAmount.toString(10),
          estimatedReward: estimatedReward.toString(10),
          apy: '',
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
      });
    });
    return staking;
  } catch (error) {
    throw new Error(`${error}`);
  }
};
