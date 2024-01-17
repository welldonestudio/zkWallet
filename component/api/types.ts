import type { Auth } from '@/store/slice/authSlice';
import type { NETWORK } from '@/store/slice/config';
import type { Wallet } from '@/store/slice/zkWalletSlice';

export interface RequestGetAddress {
  network: NETWORK;
  jwt: string;
  path: string;
}

export interface RequestGetBalance {
  auth: Auth;
  address: string;
}

export interface ResponseBalnce {
  type: string;
  name: string;
  value: string;
  fValue: string;
  locked: { [key: string]: string };
}

interface RequestBase {
  auth: Auth;
  wallet: Wallet;
}

export interface RequestSendToken extends RequestBase {
  token: {
    type: string;
    to: string;
    amount: string;
  };
}

export interface RequestSignTx extends RequestBase {
  unsignedTx: string;
}

export interface ResponseSignTx {
  unsignedTx: string;
  signature: string;
}

export interface RequestSuiStake extends RequestBase {
  stake: {
    amount: string;
    validator: string;
  };
}

export interface RequestSuiUnStake extends RequestBase {
  unStake: {
    stakedSuiId: string;
  };
}

export interface NftData {
  address: string;
  author?: string;
  img?: string;
  title: string;
  desc?: string;
  link?: string;
}

export interface RequestNftList {
  auth: Auth;
  address: string;
}

export interface ResponseNftList {
  list: NftData[];
  hasNextPage: boolean;
}

export interface StakeData {
  id: string;
  status: 'pending' | 'active' | 'unstaked';
  amount: string;
  reward: string;
  activeEpoch: string;
  requestEpoch: string;
}

export interface RequestStakeList {
  auth: Auth;
  address: string;
}

export interface ResponseStake {
  validator: {
    name: string;
    address: string;
    totalAmount: string;
    estimatedReward: string;
    apy: string;
    apyEpoch: string;
  };
  list: StakeData[];
}

export interface RequestValidator {
  auth: Auth;
}

export interface ResponseValidator {
  name: string;
  address: string;
  apy: string;
}
