import { CHAIN } from '@/store/slice/config';
import { Wallet } from '@/store/slice/zkWalletSlice';
import { SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { genAddressSeed, getZkLoginSignature } from '@mysten/zklogin';
import { utils } from '../utils';
import { decodeJwt } from 'jose';

export interface RequestSignAndSend {
  jwt: string;
  privateKey: string;
  publicKey: string;
  maxEpoch: string;
  randomness: string;
  wallet: Wallet;
  unsignedTx: string;
}

export const signAndSendTransaction = async (
  request: RequestSignAndSend,
): Promise<string> => {
  try {
    let url = '';

    switch (request.wallet.chain) {
      case 'sui:mainnet':
        url = 'https://fullnode.mainnet.sui.io';
        break;
      case 'sui:devnet':
        url = 'https://fullnode.devnet.sui.io';
        break;
      case 'sui:testnet':
        url = 'https://fullnode.testnet.sui.io';
        break;
      default:
        break;
    }

    if (!url) {
      throw new Error('not support chain');
    }

    const decodedJwt = decodeJwt(request.jwt);

    const addressSeed =
      decodedJwt.sub &&
      decodedJwt.aud &&
      genAddressSeed(
        BigInt(`0x${utils.str2buffer(request.wallet.path).toString('hex')}`!),
        'sub',
        decodedJwt.sub,
        decodedJwt.aud as string,
      ).toString();

    if (!addressSeed) {
      throw new Error(
        `jwt decode error (${decodedJwt.sub}, ${decodedJwt.aud})`,
      );
    }

    const client = new SuiClient({ url });
    const txb = TransactionBlock.from(utils.hex2buffer(request.unsignedTx));

    txb.setSender(request.wallet.address);
    const { bytes, signature: userSignature } = await txb.sign({
      client,
      signer: Ed25519Keypair.fromSecretKey(
        Buffer.from(request.privateKey.replace('0x', ''), 'hex'),
      ),
    });

    const zkLoginSignature =
      request.wallet.proof &&
      getZkLoginSignature({
        inputs: {
          ...JSON.parse(request.wallet.proof),
          addressSeed,
        },
        maxEpoch: request.maxEpoch,
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
    throw new Error(`not support provider (${request.wallet.chain})`);
  }
};
