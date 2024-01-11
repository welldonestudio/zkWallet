import { enqueueSnackbar } from 'notistack';

import { createUnstakeTransaction } from './utils/createUnstakeTransaction';

import type { RequestSuiUnStake } from '../types';

export const unStake = async (request: RequestSuiUnStake): Promise<string> => {
  try {
    const txb = createUnstakeTransaction(
      request.wallet.address,
      request.unStake.stakedSuiId,
    );
    return txb.serialize();
  } catch (error) {
    enqueueSnackbar(`${error}`, {
      variant: 'error',
    });
    throw new Error(`not support provider (${request.auth.network})`);
  }
};
