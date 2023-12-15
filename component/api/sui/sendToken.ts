import { enqueueSnackbar } from 'notistack';

import { createSendTokenTransaction } from './utils/createSendTokenTransaction';
import { signAndSendTx } from './utils/signAndSendTx';

import type { RequestSendToken } from '../types';

export const sendToken = async (request: RequestSendToken): Promise<string> => {
  try {
    const txb = createSendTokenTransaction(
      request.wallet.address,
      request.token.to,
      request.token.type,
      request.token.amount,
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
