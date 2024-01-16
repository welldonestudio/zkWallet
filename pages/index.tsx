import { useEffect } from 'react';

import { useCurrentAccount } from '@mysten/dapp-kit';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import Layout from '@/component/layout';
import { Wallet } from '@/component/pages/wallet';
import { selectAuthState } from '@/store/slice/authSlice';

export default function HomePage() {
  const router = useRouter();
  const authState = useSelector(selectAuthState);
  const account = useCurrentAccount();

  useEffect(() => {
    if (!authState || !authState.jwt || !account) {
      router.push('/signup');
    }
  }, []);

  return (
    <Layout breadcrumbs={[]} actions={<></>} initialized>
      {authState && authState.jwt && <Wallet />}
    </Layout>
  );
}
