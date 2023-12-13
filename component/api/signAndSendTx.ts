import { RequestSignAndSend } from './types';
import { signAndSendTx as suiSignAndSendTx } from './sui/signAndSendTx';

export const signAndSendTx = async (
  request: RequestSignAndSend,
): Promise<string> => {
  switch (request.wallet.network) {
    case 'sui:mainnet':
    case 'sui:devnet':
    case 'sui:testnet':
      return suiSignAndSendTx(request);
    default:
      break;
  }
  throw new Error('not support network');
};
