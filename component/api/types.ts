import type { Auth } from '@/store/slice/authSlice';
import type { NETWORK } from '@/store/slice/config';
import type { Wallet } from '@/store/slice/zkWalletSlice';

export interface RequestGetAddress {
  network: NETWORK;
  jwt: string;
  path: string;
}

export interface RequestGetBalance {
  wallet: Wallet;
}

export interface ResponseBalnce {
  name: string;
  address: string;
  value: string;
  locked: { [key: string]: string };
}

export interface RequestTransferToken {
  password: string;
  auth: Auth;
  wallet: Wallet;
  token: {
    to: string;
    address: string;
    amount: string;
  };
}
