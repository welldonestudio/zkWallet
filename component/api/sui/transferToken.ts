import { SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { genAddressSeed, getZkLoginSignature } from '@mysten/zklogin';
import { decodeJwt } from 'jose';

import { getProviderUrl } from './getProviderUrl';
import { utils } from '../utils';

import type { RequestTransferToken } from '../types';

export const transferToken = async (
  request: RequestTransferToken,
): Promise<string> => {
  try {
    console.log(request);
    const decodedJwt = request.auth.jwt && decodeJwt(request.auth.jwt);

    const addressSeed =
      decodedJwt &&
      decodedJwt.sub &&
      decodedJwt.aud &&
      genAddressSeed(
        BigInt(
          `0x${utils
            .hex2buffer(utils.str2Hash(request.wallet.path, 16))
            .toString('hex')}`,
        ),
        'sub',
        decodedJwt.sub,
        decodedJwt.aud as string,
      ).toString();

    if (!addressSeed) {
      throw new Error(`jwt decode error (${decodedJwt?.sub})`);
    }

    let url = getProviderUrl(request.auth.network);
    const client = new SuiClient({ url });
    const txb = new TransactionBlock();
    txb.setSender(request.wallet.address);

    const [coin] = txb.splitCoins(txb.gas, [100]);
    txb.transferObjects([coin], request.token.to);

    const { bytes, signature: userSignature } = await txb.sign({
      client,
      signer: Ed25519Keypair.fromSecretKey(
        request.auth.key?.privateKey
          ? Buffer.from(request.auth.key.privateKey?.replace('0x', ''), 'hex') // ??
          : Buffer.from(''),
      ),
    });

    const zkLoginSignature =
      request.wallet.proof &&
      getZkLoginSignature({
        inputs: {
          ...JSON.parse(request.wallet.proof),
          addressSeed,
        },
        maxEpoch: request.auth.maxEpoch,
        userSignature,
      });

    if (!zkLoginSignature) {
      throw new Error(`zkLoginSignature error (${request.wallet.proof})`);
    }

    const txreceipt = await client.executeTransactionBlock({
      transactionBlock: bytes,
      signature: zkLoginSignature,
    });
    return txreceipt.digest;
  } catch (error) {
    console.log(1, error);
    throw new Error(`not support provider (${request.auth.network})`);
  }
};
