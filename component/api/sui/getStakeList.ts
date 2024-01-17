import { SuiClient } from '@mysten/sui.js/client';

import { getProviderUrl } from './utils/getProviderUrl';
import { utils } from '../utils';

import type { RequestStakeList, ResponseStake } from '../types';
import type { ValidatorApy } from '@mysten/sui.js/client';

const getApy = (apys: ValidatorApy[], address: string): string => {
  const item = apys.find((apy) => address === apy.address);
  return item ? (item.apy * 100).toFixed(2) : 'n/a';
};

export const getStakeList = async (
  request: RequestStakeList,
): Promise<ResponseStake[]> => {
  try {
    let url = getProviderUrl(request.auth.network);
    const client = new SuiClient({ url });

    const { apys, epoch: apyEpoch } = await client.getValidatorsApy();

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
          totalAmount: utils.formatUnit(totalAmount.toString(10), 9),
          estimatedReward: utils.formatUnit(estimatedReward.toString(10), 9),
          apyEpoch,
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
            ? utils.formatUnit((stake as any).estimatedReward, 9)
            : '',
          amount: utils.formatUnit(stake.principal, 9),
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
