/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext } from 'react';

import { useSignTransactionBlock, useSuiClient } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { enqueueSnackbar } from 'notistack';

import { getAddress } from './getAddress';
import { getBalance } from './getBalance';
import { getNftList } from './getNftsList';
import { getStakeList } from './getStakeList';
import { getValidators } from './getValidators';
import { sendToken } from './sendToken';
import { stake } from './stake';
import { getOAuthURL } from './sui/getOAuthURL';
import { getZkProof } from './sui/getZkProof';
import { getZkSignature } from './sui/utils/getZkSignature';
import { unStake } from './unStake';
import { utils } from './utils';

import type {
  RequestGetOAuthUrl,
  ResponseGetOAuthUrl,
} from './sui/getOAuthURL';
import type { RequestGetZkProof } from './sui/getZkProof';
import type {
  RequestGetAddress,
  RequestGetBalance,
  RequestNftList,
  RequestSendToken,
  RequestSignTx,
  RequestStakeList,
  RequestSuiStake,
  RequestSuiUnStake,
  RequestValidator,
  ResponseBalnce,
  ResponseSignTx,
  ResponseStake,
  ResponseValidator,
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
    getNftList: async (
      request: RequestNftList,
    ): Promise<void> => {
      throw new Error('wallet.getBalance is not supported');
    },
    getValidators: (
      request: RequestValidator,
    ): Promise<ResponseValidator[]> => {
      throw new Error('wallet.getValidators is not supported');
    },
    getStakeList: (request: RequestStakeList): Promise<ResponseStake[]> => {
      throw new Error('wallet.getStakeList is not supported');
    },
    signTransaction: (request: RequestSignTx): Promise<ResponseSignTx> => {
      throw new Error('wallet.signTransaction is not supported');
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
  const { mutate: signTransactionBlock } = useSignTransactionBlock();
  const client = useSuiClient();

  const SignAndSendTransactionBlock = (
    req: RequestSendToken | RequestSuiStake | RequestSuiUnStake,
    txb: string,
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      signTransactionBlock(
        {
          chain: req.auth.network,
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

            client
              .executeTransactionBlock({
                transactionBlock: result.transactionBlockBytes,
                signature: zkLoginSignature,
              })
              .then((txreceipt) => {
                enqueueSnackbar(`success: ${txreceipt.digest}`, {
                  variant: 'success',
                });
                resolve(true);
              })
              .catch((error) => {
                enqueueSnackbar(`${error}`, {
                  variant: 'error',
                });
                resolve(false);
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
    });
  };

  const HandleSignTransaction = async (
    req: RequestSignTx,
  ): Promise<ResponseSignTx> => {
    try {
      return new Promise((resolve) => {
        signTransactionBlock(
          {
            chain: req.auth.network,
            transactionBlock: TransactionBlock.from(
              utils.hex2buffer(req.unsignedTx),
            ) as any, // TODO
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

              resolve({
                unsignedTx: utils.base642Hex(result.transactionBlockBytes),
                signature: utils.base642Hex(zkLoginSignature),
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
      });
    } catch (error) {
      throw `${error}`;
    }
  };

  const HandleSendToken = async (
    req: RequestSendToken,
  ): Promise<string | void> => {
    try {
      const data = await sendToken(req);
      await SignAndSendTransactionBlock(req, data);
    } catch (error) {
      throw `${error}`;
    }
  };

  const HandleStakeToken = async (
    req: RequestSuiStake,
  ): Promise<string | void> => {
    try {
      const data = await stake(req);
      await SignAndSendTransactionBlock(req, data);
    } catch (error) {
      throw `${error}`;
    }
  };

  const HandleUnStakeToken = async (
    req: RequestSuiUnStake,
  ): Promise<string | void> => {
    try {
      const data = await unStake(req);
      await SignAndSendTransactionBlock(req, data);
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
          getNftList: getNftList,
          getValidators: getValidators,
          getStakeList: getStakeList,
          sendToken: HandleSendToken,
          signTransaction: HandleSignTransaction,
          stake: HandleStakeToken,
          unStake: HandleUnStakeToken,
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
