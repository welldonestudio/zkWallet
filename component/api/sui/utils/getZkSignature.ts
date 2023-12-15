import { genAddressSeed, getZkLoginSignature } from '@mysten/zklogin';
import { decodeJwt } from 'jose';
import { enqueueSnackbar } from 'notistack';

import { utils } from '../../utils';

import type { Auth } from '@/store/slice/authSlice';
import type { Wallet } from '@/store/slice/zkWalletSlice';

export const getZkSignature = (
  auth: Auth,
  wallet: Wallet,
  userSignature: string,
): string | undefined => {
  const decodedJwt = auth.jwt && decodeJwt(auth.jwt);

  const addressSeed =
    decodedJwt &&
    decodedJwt.sub &&
    decodedJwt.aud &&
    genAddressSeed(
      BigInt(
        `0x${utils
          .hex2buffer(utils.str2Hash(wallet.path, 16))
          .toString('hex')}`,
      ),
      'sub',
      decodedJwt.sub,
      decodedJwt.aud as string,
    ).toString();

  if (!addressSeed) {
    enqueueSnackbar('jwt decode error', {
      variant: 'error',
    });
    throw new Error(`jwt decode error (${decodedJwt?.sub})`);
  }

  const zkLoginSignature =
    wallet.proof &&
    getZkLoginSignature({
      inputs: {
        ...JSON.parse(wallet.proof),
        addressSeed,
      },
      maxEpoch: auth.maxEpoch,
      userSignature,
    });

  return zkLoginSignature;
};
