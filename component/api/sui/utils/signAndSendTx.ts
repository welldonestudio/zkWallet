import { SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { enqueueSnackbar } from 'notistack';

import { getPrivateKey } from './getPrivateKey';
import { getProviderUrl } from './getProviderUrl';
import { getZkSignature } from './getZkSignature';

import type { RequestSend } from '../../types';
import type { TransactionBlock } from '@mysten/sui.js/transactions';

export const signAndSendTx = async (
  request: RequestSend,
  txb: TransactionBlock,
): Promise<string> => {
  try {
    if (request.password && request.auth.key.encrypt) {
      let url = getProviderUrl(request.auth.network);

      const privateKey = await getPrivateKey(
        request.password,
        request.auth.key.encrypt,
      );

      const client = new SuiClient({ url });

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
      return txreceipt.digest;
    }
    throw new Error(`wallet error (${request.auth.key.publicKey})`);
  } catch (error) {
    enqueueSnackbar(`${error}`, {
      variant: 'error',
    });
    throw new Error(`send trasaction error (${request.auth.network})`);
  }
};
