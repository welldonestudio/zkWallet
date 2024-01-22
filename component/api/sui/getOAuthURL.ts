import { SuiClient } from '@mysten/sui.js/client';
import { Ed25519PublicKey } from '@mysten/sui.js/keypairs/ed25519';
import { generateNonce, generateRandomness } from '@mysten/zklogin';

import { utils } from '../utils';

import type { CRYPTO, NETWORK, PROVIDER } from '@/store/slice/config';

export interface RequestGetOAuthUrl {
  provider: PROVIDER;
  clientId: string;
  redirectUrl: string;
  network: NETWORK;
  duration: number;
  publicKey: string;
  randomness?: string;
}

export interface ResponseGetOAuthUrl {
  url: string;
  crypto: CRYPTO;
  publicKey: string;
  randomness: string;
  maxEpoch: number;
}

export const getOAuthURL = async (
  request: RequestGetOAuthUrl,
): Promise<ResponseGetOAuthUrl> => {
  let url = '';

  switch (request.network) {
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
    throw new Error('not support network');
  }

  const suiClient = new SuiClient({ url });
  const { epoch } = await suiClient.getLatestSuiSystemState();
  const maxEpoch = Number(epoch) + request.duration;

  const randomness = request.randomness || generateRandomness();

  const nonce = generateNonce(
    new Ed25519PublicKey(utils.hex2buffer(request.publicKey)),
    maxEpoch,
    randomness,
  );

  if (!nonce) {
    throw new Error('nonce error');
  }

  switch (request.provider) {
    case 'google':
      return {
        url: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${request.clientId}&response_type=id_token&redirect_uri=${request.redirectUrl}&scope=openid email profile&nonce=${nonce}`,
        randomness,
        maxEpoch,
        crypto: 'ed25519',
        publicKey: request.publicKey as string,
      };
    /*
        case 'facebook':
            break;
        case 'twitch':
            break;
        case 'kakao':
            break;
        case 'apple':
            break;
        case 'slack':
            break;
    */
    default:
      break;
  }
  throw new Error(`not support provider (${request.provider})`);
};
