import { SuiClient } from '@mysten/sui.js/client';

import { getProviderUrl } from './utils/getProviderUrl';
import { utils } from '../utils';

import type { RequestGetStake, ResponseStake } from '../types';
import type { ValidatorApy } from '@mysten/sui.js/client';

const getApy = (apys: ValidatorApy[], address: string) => {
  const item = apys.find((apy) => address === apy.address);
  return item ? (item.apy * 100).toFixed(2) : 'n/a';
};

export const getStakes = async (
  request: RequestGetStake,
): Promise<ResponseStake[]> => {
  try {
    let url = getProviderUrl(request.auth.network);
    const client = new SuiClient({ url });

    const { apys } = await client.getValidatorsApy();

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
          name: '', // TODO
          address: item.validatorAddress,
          totalAmount: utils.formatUnit(totalAmount.toString(10), 6),
          estimatedReward: utils.formatUnit(estimatedReward.toString(10), 6),
          apy: getApy(apys, item.validatorAddress),
        },
        stakes: item.stakes.map((stake) => ({
          id: stake.stakedSuiId,
          status:
            stake.status === 'Active'
              ? 'active'
              : stake.status === 'Pending'
                ? 'pending'
                : 'unstaked',
          reward: (stake as any).estimatedReward
            ? utils.formatUnit((stake as any).estimatedReward, 6)
            : '',
          amount: utils.formatUnit(stake.principal, 6),
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
