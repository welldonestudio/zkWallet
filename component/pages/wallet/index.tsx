import { Grid } from '@mui/material';
import { useCurrentAccount } from '@mysten/dapp-kit';

import Layout from '@/component/layout';

import { Assets } from './assets';
import { Stake } from './stake';

export const WalletPage = () => {
  const account = useCurrentAccount();

  return (
    <Layout breadcrumbs={[]} actions={<></>} initialized>
      {account && (
        <Grid container spacing={2} paddingY={4}>
          <Grid container item xs={12}>
            <Assets />
          </Grid>
          <Grid item xs={12}>
            <Stake />
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};
