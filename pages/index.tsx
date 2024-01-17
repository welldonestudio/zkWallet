import { useEffect } from 'react';

import { useCurrentAccount, useCurrentWallet } from '@mysten/dapp-kit';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import Layout from '@/component/layout';
import { Wallet } from '@/component/pages/wallet';
import { selectAuthState } from '@/store/slice/authSlice';

export default function HomePage() {
  const router = useRouter();
  const authState = useSelector(selectAuthState);
  const account = useCurrentAccount();
  const wallet = useCurrentWallet();

  useEffect(() => {
    if (!authState || !authState.jwt) {
      router.push('/signup');
    } else if (!account) {
      console.log(wallet)
    }
  }, []);

  return (
    <Layout breadcrumbs={[]} actions={<></>} initialized>
      {authState && authState.jwt && <Wallet />}
    </Layout>
  );
}
