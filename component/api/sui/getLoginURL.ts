import { NETWORK, CLIENT_ID, CRYPTO, PROVIDER } from '@/store/slice/config';
import { SuiClient } from '@mysten/sui.js/client';
import { Ed25519PublicKey } from '@mysten/sui.js/keypairs/ed25519';
import { generateNonce, generateRandomness } from '@mysten/zklogin';
import { utils } from '../utils';

export interface RequestGetLoginUrl {
  provider: PROVIDER;
  redirectUrl: string;
  network: NETWORK;
  crypto: CRYPTO;
  publicKey: string;
}

export interface ResponseGetLoginUrl {
  url: string;
  randomness: string;
  maxEpoch: number;
}

export const getLoginURL = async (
  request: RequestGetLoginUrl,
): Promise<ResponseGetLoginUrl> => {
  if (CLIENT_ID[request.provider]) {
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
    const maxEpoch = Number(epoch) + 10;

    const randomness = generateRandomness();
    const nonce =
      request.crypto === 'ed25519' &&
      generateNonce(
        new Ed25519PublicKey(
          utils.hex2buffer(request.publicKey).toString('base64'),
        ),
        maxEpoch,
        randomness,
      );

    if (!nonce) {
      throw new Error('nonce error');
    }

    switch (request.provider) {
      case 'google':
        return {
          url: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
            CLIENT_ID[request.provider]
          }&response_type=id_token&redirect_uri=${
            request.redirectUrl
          }&scope=openid&nonce=${nonce}`,
          randomness,
          maxEpoch,
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
  }

  throw new Error(`not support provider (${request.provider})`);
};
