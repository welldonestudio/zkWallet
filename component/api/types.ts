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
  locked: { [key: string]: string };
}

export interface RequestTransferToken {
  password: string;
  auth: Auth;
  wallet: Wallet;
  token: {
    type: string;
    to: string;
    amount: string;
  };
}
