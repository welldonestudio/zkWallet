import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SUI_SYSTEM_STATE_OBJECT_ID } from '@mysten/sui.js/utils';

export const createStakeTransaction = (
  from: string,
  amount: bigint,
  validator: string,
): TransactionBlock => {
  const txb = new TransactionBlock();
  txb.setSender(from);
  const stakeCoin = txb.splitCoins(txb.gas, [txb.pure(amount)]);
  txb.moveCall({
    target: '0x3::sui_system::request_add_stake',
    arguments: [
      txb.object(SUI_SYSTEM_STATE_OBJECT_ID),
      stakeCoin,
      txb.pure(validator),
    ],
  });
  return txb;
};
