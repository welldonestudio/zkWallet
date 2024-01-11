import { enqueueSnackbar } from 'notistack';

import { createSendTokenTransaction } from './utils/createSendTokenTransaction';
import { utils } from '../utils';

import type { RequestSendToken } from '../types';

export const sendToken = async (request: RequestSendToken): Promise<string> => {
  try {
    const txb = createSendTokenTransaction(
      request.wallet.address,
      request.token.to,
      request.token.type,
      request.token.type === '0x2::sui::SUI'
        ? utils.parseUnit(request.token.amount, 9)
        : request.token.amount,
    );
    return txb.serialize();
  } catch (error) {
    enqueueSnackbar(`${error}`, {
      variant: 'error',
    });
    throw new Error(`not support provider (${request.auth.network})`);
  }
};
