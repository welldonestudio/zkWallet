import { NETWORK } from '@/store/slice/config';

export interface RequestGetAddress {
  network: NETWORK;
  jwt: string;
  path: string;
}
