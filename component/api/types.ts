import { NETWORK } from '@/store/slice/config';
import { Wallet } from '@/store/slice/zkWalletSlice';

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
  value: string;
  locked: { [key: string]: string };
}

export interface RequestSignAndSend {
  jwt: string;
  privateKey: string;
  publicKey: string;
  network: NETWORK;
  maxEpoch: string;
  randomness: string;
  wallet: Wallet;
  unsignedTx: string;
}
