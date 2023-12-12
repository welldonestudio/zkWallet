import { NETWORK } from '@/store/slice/config';
import { utils } from '../utils';

export interface RequestGetZkProof {
  network: NETWORK;
  jwt: string;
  publicKey: string;
  maxEpoch: string;
  randomness: string;
  path: string;
}

export const getZkProof = async (
  request: RequestGetZkProof,
): Promise<string> => {
  try {
    let url = '';

    switch (request.network) {
      case 'sui:mainnet':
      case 'sui:testnet':
        url = 'https://prover.mystenlabs.com/v1';
        break;
      case 'sui:devnet':
        url = 'https://prover-dev.mystenlabs.com/v1';
        break;
      default:
        break;
    }

    if (url) {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jwt: request.jwt,
          extendedEphemeralPublicKey: utils
            .hex2buffer(request.publicKey)
            .toString('base64'),
          maxEpoch: request.maxEpoch,
          jwtRandomness: utils
            .hex2buffer(request.randomness)
            .toString('base64'),
          salt: utils
            .hex2buffer(utils.str2Hash(request.path))
            .toString('base64'),
          keyClaimName: 'sub',
        }),
      });
      const json = await res.json();
      return JSON.stringify(json);
    }
    throw new Error('not support network');
  } catch (error) {
    throw new Error(`${error}`);
  }
};
