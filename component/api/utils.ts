import { keccak_256 } from '@noble/hashes/sha3';

export const utils = {
  hex2buffer: (hex: string): Buffer => {
    return Buffer.from(hex.replace('0x', ''), 'hex');
  },
  str2buffer: (str: string): Buffer => {
    return Buffer.from(str, 'utf-8');
  },
  str2Hash: (str: string, bytes: 8 | 16 | 32 = 32): string => {
    return `0x${Buffer.from(keccak_256(str))
      .toString('hex')
      .slice(0, bytes * 2)}`;
  },
  base642Hex: (b64: string): string => {
    return `0x${Buffer.from(b64, 'base64').toString('hex')}`;
  },
  shortenString: (str: string, prefix: number = 4, postfix: number = 4): string => {
    if (str.length > prefix + postfix + 3) {
      return `${str.slice(0, prefix)}...${str.slice(-postfix)}`
    }
    return str;
  },
};
