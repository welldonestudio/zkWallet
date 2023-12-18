import { createContext, useContext } from 'react';

import { useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';

import { getAddress } from './getAddress';
import { getBalance } from './getBalance';
import { getStakes } from './getStakes';
import { sendToken } from './sendToken';
import { stake } from './stake';
import { getOAuthURL } from './sui/getOAuthURL';
import { getZkProof } from './sui/getZkProof';
import { unStake } from './unStake';

import type {
  RequestGetOAuthUrl,
  ResponseGetOAuthUrl,
} from './sui/getOAuthURL';
import type { RequestGetZkProof } from './sui/getZkProof';
import type {
  RequestGetAddress,
  RequestGetBalance,
  RequestGetStake,
  RequestSendToken,
  RequestSuiStake,
  RequestSuiUnStake,
  ResponseBalnce,
  ResponseStake,
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
    stake: (request: RequestSuiStake): Promise<string> => {
      throw new Error('wallet.stake is not supported');
    },
    unStake: (request: RequestSuiUnStake): Promise<string> => {
      throw new Error('wallet.unStake is not supported');
    },
    getStakes: (request: RequestGetStake): Promise<ResponseStake[]> => {
      throw new Error('wallet.getStakes is not supported');
    },
  },
});

export default function ApiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { mutate: signAndExecuteTransactionBlock } =
    useSignAndExecuteTransactionBlock();

  const HandleSendToken = async (req: RequestSendToken): Promise<string> => {
    console.log(1, req);
    if (req.password) {
      return sendToken(req);
    }

    const txb = await sendToken(req);
    console.log(2, txb);

    try {
      signAndExecuteTransactionBlock(
        {
          chain: 'sui:devnet',
          transactionBlock: TransactionBlock.from(txb) as any, // TODO
        },
        {
          onSuccess: (result) => {
            console.log('executed transaction block', result);
          },
          onError: (result) => {
            console.log(result);
          }
        },
      );  
    } catch (error) {
      console.log(999, error);
    }
    return '';
  };

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
          sendToken: HandleSendToken,
          stake: stake,
          unStake: unStake,
          getStakes: getStakes,
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
