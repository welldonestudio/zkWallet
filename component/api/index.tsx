import { createContext, useContext } from 'react';

import { useSignTransactionBlock, useSuiClient } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { enqueueSnackbar } from 'notistack';

import { getAddress } from './getAddress';
import { getBalance } from './getBalance';
import { getStakes } from './getStakes';
import { sendToken } from './sendToken';
import { stake } from './stake';
import { getOAuthURL } from './sui/getOAuthURL';
import { getZkProof } from './sui/getZkProof';
import { getZkSignature } from './sui/utils/getZkSignature';
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
    getStakes: (request: RequestGetStake): Promise<ResponseStake[]> => {
      throw new Error('wallet.getStakes is not supported');
    },
    sendToken: (request: RequestSendToken): Promise<string | void> => {
      throw new Error('wallet.sendToken is not supported');
    },
    stake: (request: RequestSuiStake): Promise<string | void> => {
      throw new Error('wallet.stake is not supported');
    },
    unStake: (request: RequestSuiUnStake): Promise<string | void> => {
      throw new Error('wallet.unStake is not supported');
    },
  },
});

export default function ApiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { mutate: signTransactionBlock } =
  useSignTransactionBlock();
  const client = useSuiClient();

  const HandleSendToken = async (
    req: RequestSendToken,
  ): Promise<string | void> => {
    if (req.password) {
      const hash = await sendToken(req);
      enqueueSnackbar(`success: ${hash}`, {
        variant: 'success',
      });
      return hash;
    }

    try {
      const txb = await sendToken(req);
      //////////////////////////////
      signTransactionBlock(
        {
          chain: 'sui:devnet',
          transactionBlock: TransactionBlock.from(txb) as any, // TODO
        },
        {
          onSuccess: (result) => {
            // create zk signature
            const zkLoginSignature =
              req.auth.jwt &&
              req.wallet.proof &&
              getZkSignature(req.auth, req.wallet, result.signature);

            if (!zkLoginSignature) {
              enqueueSnackbar('zkLoginSignature error', {
                variant: 'error',
              });
              throw new Error(`zkLoginSignature error (${req.wallet.proof})`);
            }

            client.executeTransactionBlock({
              transactionBlock: result.transactionBlockBytes,
              signature: zkLoginSignature,
            }).then((txreceipt) => {
              enqueueSnackbar(`success: ${txreceipt.digest}`, {
                variant: 'success',
              });
            }).catch((error) => {
              enqueueSnackbar(`${error}`, {
                variant: 'error',
              });              
            });
          },
          onError: (result) => {
            enqueueSnackbar(result.message, {
              variant: 'error',
            });
            throw new Error(result.message);
          },
        },
      );
      //////////////////////////////
    } catch (error) {
      throw `${error}`;
    }
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
          getStakes: getStakes,
          sendToken: HandleSendToken,
          stake: stake,
          unStake: unStake,
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
