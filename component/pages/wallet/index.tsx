import { useEffect, useState } from 'react';

import { Grid } from '@mui/material';
import { useCurrentAccount, useCurrentWallet } from '@mysten/dapp-kit';
import { useSelector } from 'react-redux';

import { useContextApi } from '@/component/api';
import { type ResponseBalnce } from '@/component/api/types';
import Layout from '@/component/layout';
import { selectAuthState } from '@/store/slice/authSlice';
import { selectWalletState } from '@/store/slice/zkWalletSlice';

import { Assets } from './assets';
import { Balances } from './balances';

export const WalletPage = () => {
  const authState = useSelector(selectAuthState);
  const walletState = useSelector(selectWalletState);
  const { wallet } = useContextApi();

	const { currentWallet } = useCurrentWallet();
	const currentAccount = useCurrentAccount();

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
      console.log(1, currentWallet);
      console.log(2, currentAccount);
    };
    walletState.wallets[0] && update();
  }, [walletState.wallets]);

  return (
    <Layout breadcrumbs={[]} actions={<></>} initialized>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6}>
          <Balances balances={balances} />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Assets balances={balances} />
        </Grid>
      </Grid>
    </Layout>
  );
};
