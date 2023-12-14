import { Ed25519PublicKey } from '@mysten/sui.js/keypairs/ed25519';
import { getExtendedEphemeralPublicKey } from '@mysten/zklogin';

import { utils } from '../utils';

import type { NETWORK } from '@/store/slice/config';


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
          extendedEphemeralPublicKey: getExtendedEphemeralPublicKey(
            new Ed25519PublicKey(utils.hex2buffer(request.publicKey)),
          ),
          maxEpoch: request.maxEpoch,
          jwtRandomness: request.randomness,
          salt: utils
            .hex2buffer(utils.str2Hash(request.path, 16))
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
