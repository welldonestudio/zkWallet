import { useEffect } from 'react';

import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import Layout from '@/component/layout';
import { Wallet } from '@/component/pages/wallet';
import { selectAuthState } from '@/store/slice/authSlice';

export default function HomePage() {
  const router = useRouter();
  const authState = useSelector(selectAuthState);

  useEffect(() => {
    if (!authState || !authState.jwt) {
      router.push('/signup');
    }
  }, []);

  return (
    <Layout initialized>{authState && authState.jwt && <Wallet />}</Layout>
  );
}
