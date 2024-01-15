import { useEffect, useState } from 'react';

import { Grid } from '@mui/material';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useSelector } from 'react-redux';

import { useContextApi } from '@/component/api';
import { SendTokenModal } from '@/component/dialog/sendToken';
import { selectAuthState } from '@/store/slice/authSlice';
import { selectWalletState } from '@/store/slice/zkWalletSlice';

import { Assets } from './assets';
import { Stake } from './stake';

import type { ResponseValidator } from '@/component/api/types';

export const Wallet = () => {
  const account = useCurrentAccount();
  const authState = useSelector(selectAuthState);
  const walletState = useSelector(selectWalletState);
  const { wallet } = useContextApi();

  const [openSend, setOpenSend] = useState<boolean>(false);
  const [openStake, setOpenStake] = useState<boolean>(false);

  const [validators, setVelidators] = useState<ResponseValidator[]>([]);
  const [count, setCount] = useState<number>(0);

  const handleSendConfirm = async (to: string, amount: string) => {
    try {
      authState &&
        (await wallet.sendToken({
          auth: authState,
          wallet: walletState.wallets[0],
          token: {
            to,
            type: '0x2::sui::SUI',
            amount,
          },
        }));
      setCount(count + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStakeConfirm = async (to: string, amount: string) => {
    try {
      authState &&
        (await wallet.stake({
          auth: authState,
          wallet: walletState.wallets[0],
          stake: {
            amount,
            validator: to,
          },
        }));
      setCount(count + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnStakeConfirm = async (stakeId: string) => {
    try {
      authState &&
        (await wallet.unStake({
          auth: authState,
          wallet: walletState.wallets[0],
          unStake: {
            stakedSuiId: stakeId,
          },
        }));
      setCount(count + 1);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      const vali =
        authState && (await wallet.getValidators({ auth: authState }));
      setVelidators(vali || []);
    };
    init();
  }, [authState]);

  return (
    <>
      {!!account && (
        <Grid container spacing={2} paddingY={4}>
          <Grid container item xs={12}>
            <Assets
              count={count}
              openSend={setOpenSend}
              openStake={setOpenStake}
            />
          </Grid>
          <Grid item xs={12}>
            <Stake
              count={count}
              openStake={setOpenStake}
              unstake={handleUnStakeConfirm}
            />
          </Grid>
        </Grid>
      )}
      <SendTokenModal
        title="Transfer Token"
        open={openSend}
        onClose={() => setOpenSend(false)}
        confirm={handleSendConfirm}
      />
      <SendTokenModal
        title="Stake"
        open={openStake}
        onClose={() => setOpenStake(false)}
        confirm={handleStakeConfirm}
        validators={validators}
      />
    </>
  );
};
