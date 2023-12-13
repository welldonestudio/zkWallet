import { createContext, useContext } from 'react';
import {
  RequestGetLoginUrl,
  ResponseGetLoginUrl,
  getLoginURL,
} from './sui/getLoginURL';
import { RequestGetZkProof, getZkProof } from './sui/getZkProof';
import {
  RequestGetAddress,
  RequestGetBalance,
  RequestTransferToken,
  ResponseBalnce,
} from './types';
import { getAddress } from './getAddress';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { getBalance } from './getBalance';
import { transferToken } from './transferToken';

export const ApiContext = createContext({
  jwt: {
    sui: {
      getLoginURL: async (
        request: RequestGetLoginUrl,
      ): Promise<ResponseGetLoginUrl> => {
        throw new Error('jwt.sui.getLoginURL is not supported');
      },
      getZkProof: async (request: RequestGetZkProof): Promise<string> => {
        throw new Error('jwt.sui.getZkProof is not supported');
      },
    },
  },
  wallet: {
    getAddress: async (request: RequestGetAddress): Promise<string> => {
      throw new Error('wallet.getAddress is not supported');
    },
    getBalance: async (
      request: RequestGetBalance,
    ): Promise<ResponseBalnce[]> => {
      throw new Error('wallet.getBalance is not supported');
    },
    transferToken: (request: RequestTransferToken): Promise<string> => {
      throw new Error('wallet.transferToken is not supported');
    },
  },
  utils: {
    keyPair: {
      ed25519: (): { publicKey: string; privateKey: string } => {
        throw new Error('utils.keyPair.Ed25519 is not supported');
      },
    },
  },
});

export default function ApiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ApiContext.Provider
      value={{
        jwt: {
          sui: {
            getLoginURL: getLoginURL,
            getZkProof: getZkProof,
          },
        },
        wallet: {
          getAddress: getAddress,
          getBalance: getBalance,
          transferToken: transferToken,
        },
        utils: {
          keyPair: {
            ed25519: () => {
              const key = new Ed25519Keypair();
              return {
                publicKey: `0x${Buffer.from(
                  key.getPublicKey().toBase64(),
                  'base64',
                ).toString('hex')}`,
                privateKey: `0x${Buffer.from(
                  key.export().privateKey,
                  'base64',
                ).toString('hex')}`,
              };
            },
          },
        },
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}

export const useContextApi = () => {
  return useContext(ApiContext);
};
