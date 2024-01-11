import { enqueueSnackbar } from 'notistack';

import { createStakeTransaction } from './utils/createStakeTransaction';
import { utils } from '../utils';

import type { RequestSuiStake } from '../types';

export const stake = async (request: RequestSuiStake): Promise<string> => {
  try {
    const txb = createStakeTransaction(
      request.wallet.address,
      utils.parseUnit(request.stake.amount, 9),
      request.stake.validator,
    );
    return txb.serialize();
  } catch (error) {
    enqueueSnackbar(`${error}`, {
      variant: 'error',
    });
    throw new Error(`not support provider (${request.auth.network})`);
  }
};
