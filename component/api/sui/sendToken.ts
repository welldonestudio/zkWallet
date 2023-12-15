import { SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { enqueueSnackbar } from 'notistack';

import { getProviderUrl } from './getProviderUrl';
import { createSendTokenTransaction } from './utils/createSendTokenTransaction';
import { getPrivateKey } from './utils/getPrivateKey';
import { getZkSignature } from './utils/getZkSignature';

import type { RequestTransferToken } from '../types';

export const sendToken = async (
  request: RequestTransferToken,
): Promise<string> => {
  try {
    let url = getProviderUrl(request.auth.network);

    const privateKey = await getPrivateKey(
      request.password,
      request.auth.key.encrypt,
    );

    const client = new SuiClient({ url });

    // create tx
    const txb = createSendTokenTransaction(
      request.wallet.address,
      request.token.to,
      request.token.type,
      100, // TODO
    );

    // sign tx
    const { bytes, signature: userSignature } = await txb.sign({
      client,
      signer: Ed25519Keypair.fromSecretKey(
        Buffer.from(privateKey.replace('0x', ''), 'hex'),
      ),
    });

    // create zk signature
    const zkLoginSignature =
      request.auth.jwt &&
      request.wallet.proof &&
      getZkSignature(request.auth, request.wallet, userSignature);

    if (!zkLoginSignature) {
      enqueueSnackbar('zkLoginSignature error', {
        variant: 'error',
      });
      throw new Error(`zkLoginSignature error (${request.wallet.proof})`);
    }

    const txreceipt = await client.executeTransactionBlock({
      transactionBlock: bytes,
      signature: zkLoginSignature,
    });
    enqueueSnackbar(`success: ${txreceipt.digest}`, {
      variant: 'success',
    });
    return txreceipt.digest;
  } catch (error) {
    enqueueSnackbar(`${error}`, {
      variant: 'error',
    });
    throw new Error(`not support provider (${request.auth.network})`);
  }
};
