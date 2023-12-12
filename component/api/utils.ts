import { keccak_256 } from '@noble/hashes/sha3';

export const utils = {
  hex2buffer: (hex: string): Buffer => {
    return Buffer.from(hex.replace('0x', ''), 'hex');
  },
  str2buffer: (str: string): Buffer => {
    return Buffer.from(str, 'utf-8');
  },
  str2Hash: (str: string): string => {
    return `0x${Buffer.from(keccak_256(str)).toString('hex')}`;
  },
};
