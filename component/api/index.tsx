import { createContext, useContext } from 'react';

import { getAddress } from './getAddress';
import { getBalance } from './getBalance';
import { sendToken } from './sendToken';
import { getOAuthURL } from './sui/getOAuthURL';
import { getZkProof } from './sui/getZkProof';

import type {
  RequestGetOAuthUrl,
  ResponseGetOAuthUrl,
} from './sui/getOAuthURL';
import type { RequestGetZkProof } from './sui/getZkProof';
import type {
  RequestGetAddress,
  RequestGetBalance,
  RequestSendToken,
  ResponseBalnce,
} from './types';

export const ApiContext = createContext({
  jwt: {
    sui: {
      getOAuthURL: async (
        request: RequestGetOAuthUrl,
      ): Promise<ResponseGetOAuthUrl> => {
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
    sendToken: (request: RequestSendToken): Promise<string> => {
      throw new Error('wallet.sendToken is not supported');
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
            getOAuthURL: getOAuthURL,
            getZkProof: getZkProof,
          },
        },
        wallet: {
          getAddress: getAddress,
          getBalance: getBalance,
          sendToken: sendToken,
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
