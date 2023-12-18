import { enqueueSnackbar } from 'notistack';

import { createStakeTransaction } from './utils/createStakeTransaction';
import { signAndSendTx } from './utils/signAndSendTx';

import type { RequestSuiStake } from '../types';

export const stake = async (request: RequestSuiStake): Promise<string> => {
  try {
    const txb = createStakeTransaction(
      request.wallet.address,
      request.stake.amount,
      request.stake.validator,
    );

    if (request.auth.key.type === 'local') {
      const hash = await signAndSendTx(request, txb);
      return hash;
    }

    return txb.serialize();
  } catch (error) {
    enqueueSnackbar(`${error}`, {
      variant: 'error',
    });
    throw new Error(`not support provider (${request.auth.network})`);
  }
};
