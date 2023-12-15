import { TransactionBlock } from '@mysten/sui.js/transactions';

export const createSendTokenTransaction = (
  from: string,
  to: string,
  type: string,
  amount: number,
): TransactionBlock => {
  const txb = new TransactionBlock();
  txb.setSender(from);

  if (type === '0x2::sui::SUI') {
    const [coin] = txb.splitCoins(txb.gas, [txb.pure(amount)]);
    txb.transferObjects([coin], to);
  }

  return txb;
};
