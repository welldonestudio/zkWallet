import { Stack } from '@mui/material';
import { useCurrentAccount } from '@mysten/dapp-kit';

import Layout from '@/component/layout';

import { Assets } from './assets';
import { Stake } from './stake';

export const WalletPage = () => {
  const account = useCurrentAccount();

  return (
    <Layout breadcrumbs={[]} actions={<></>} initialized>
      {account && (
        <Stack spacing={4} paddingTop={4}>
          <Assets />
          <Stake />
        </Stack>
      )}
    </Layout>
  );
};
