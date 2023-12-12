import { CHAIN } from '@/store/slice/config';

export interface RequestGetAddress {
  chain: CHAIN;
  jwt: string;
  path: string;
}
