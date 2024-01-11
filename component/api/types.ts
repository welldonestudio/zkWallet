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

export interface RequestSend {
  password?: string;
  auth: Auth;
  wallet: Wallet;
}

export interface RequestSendToken extends RequestSend {
  token: {
    type: string;
    to: string;
    amount: string;
  };
}

export interface RequestSuiStake extends RequestSend {
  stake: {
    amount: string;
    validator: string;
  };
}

export interface RequestSuiUnStake extends RequestSend {
  unStake: {
    stakedSuiId: string;
  };
}

export interface RequestGetStake {
  auth: Auth;
  address: string;
}

export interface StakeData {
  id: string;
  status: 'pending' | 'active' | 'unstaked';
  amount: string;
  reward: string;
  activeEpoch: string;
  requestEpoch: string;
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
  stakes: StakeData[];
}

export interface RequestValidator {
  auth: Auth;
}

export interface ResponseValidator {
  name: string;
  address: string;
  apy: string;
}
