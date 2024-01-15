import { useEffect, useState } from 'react';

import { Grid } from '@mui/material';
import {
  useConnectWallet,
  useCurrentAccount,
  useCurrentWallet,
  useWallets,
} from '@mysten/dapp-kit';
import { useSelector } from 'react-redux';

import { useContextApi } from '@/component/api';
import SendTokenModal from '@/component/dialog/sendToken';
import Layout from '@/component/layout';
import { selectAuthState } from '@/store/slice/authSlice';
import { selectWalletState } from '@/store/slice/zkWalletSlice';

import { Assets } from './assets';
import { Stake } from './stake';

import type { ResponseValidator } from '@/component/api/types';

export const WalletPage = () => {
  const account = useCurrentAccount();
  const authState = useSelector(selectAuthState);
  const walletState = useSelector(selectWalletState);
  const { wallet: api } = useContextApi();

  const wallets = useWallets();
  const { currentWallet, connectionStatus } = useCurrentWallet();
  const { mutate: connect } = useConnectWallet();

  const [openSend, setOpenSend] = useState<boolean>(false);
  const [openStake, setOpenStake] = useState<boolean>(false);

  const [validators, setVelidators] = useState<ResponseValidator[]>([]);
  const [count, setCount] = useState<number>(0);

  const handleSendConfirm = async (to: string, amount: string) => {
    authState &&
      (await api.sendToken({
        auth: authState,
        wallet: walletState.wallets[0],
        token: {
          to,
          type: '0x2::sui::SUI',
          amount,
        },
      }));
    setCount(count + 1);
  };

  const handleStakeConfirm = async (to: string, amount: string) => {
    authState &&
      (await api.stake({
        auth: authState,
        wallet: walletState.wallets[0],
        stake: {
          amount,
          validator: to,
        },
      }));
    setCount(count + 1);
  };

  useEffect(() => {
    const init = async () => {
      if (authState) {
        const vali = await api.getValidators({ auth: authState });
        setVelidators(vali || []);
        console.log(111, currentWallet);
        console.log(222, connectionStatus);
        console.log(333, wallets);
        console.log(444, connect);
        currentWallet &&
          connect(
            { wallet: currentWallet },
            {
              onSuccess: () => console.log('connected'),
            },
          );
      }
    };
    init();
  }, [authState]);

  return (
    <Layout breadcrumbs={[]} actions={<></>} initialized>
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
            <Stake count={count} openStake={setOpenStake} />
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
    </Layout>
  );
};
