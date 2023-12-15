import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SUI_SYSTEM_STATE_OBJECT_ID } from '@mysten/sui.js/utils';

export const createUnstakeTransaction = (
  from: string,
  stakedSuiId: string,
): TransactionBlock => {
  const txb = new TransactionBlock();
  txb.setSender(from);
  txb.moveCall({
    target: '0x3::sui_system::request_withdraw_stake',
    arguments: [
      txb.object(SUI_SYSTEM_STATE_OBJECT_ID),
      txb.object(stakedSuiId),
    ],
  });
  return txb;
};
