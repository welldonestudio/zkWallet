import { enqueueSnackbar } from 'notistack';

import { createUnstakeTransaction } from './utils/createUnstakeTransaction';
import { signAndSendTx } from './utils/signAndSendTx';

import type { RequestSuiUnStake } from '../types';

export const unStake = async (request: RequestSuiUnStake): Promise<string> => {
  try {
    const txb = createUnstakeTransaction(
      request.wallet.address,
      request.unStake.stakedSuiId,
    );
    const hash = await signAndSendTx(request, txb);
    return hash;
  } catch (error) {
    enqueueSnackbar(`${error}`, {
      variant: 'error',
    });
    throw new Error(`not support provider (${request.auth.network})`);
  }
};