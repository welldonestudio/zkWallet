import { useEffect, useState } from 'react';

import { Grid } from '@mui/material';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useSelector } from 'react-redux';

import { useContextApi } from '@/component/api';
import { type ResponseBalnce } from '@/component/api/types';
import Layout from '@/component/layout';
import { selectAuthState } from '@/store/slice/authSlice';
import { selectWalletState } from '@/store/slice/zkWalletSlice';

import { Assets } from './assets';
import { Stake } from './stake';

export const WalletPage = () => {
  const authState = useSelector(selectAuthState);
  const walletState = useSelector(selectWalletState);
  const { wallet } = useContextApi();

  const account = useCurrentAccount();

  const [balances, setBalances] = useState<ResponseBalnce[]>([]);

  useEffect(() => {
    const update = async () => {
      const _balances =
        authState &&
        (await wallet.getBalance({
          auth: authState,
          address: walletState.selected,
        }));
      _balances && setBalances(_balances);
      console.log('balance', _balances);
    };
    walletState.wallets[0] && update();
  }, [walletState.wallets]);

  return (
    <Layout breadcrumbs={[]} actions={<></>} initialized>
      {account && (
        <Grid container spacing={2}>
          <Grid item xs={12} height="360px">
            <Assets balances={balances} />
          </Grid>
          <Grid item xs={12}>
            <Stake />
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};
