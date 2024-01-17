import { useEffect } from 'react';

import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import Layout from '@/component/layout';
import { Connect } from '@/component/pages/connect';
import { selectAuthState } from '@/store/slice/authSlice';

export default function ConnectPage() {
  const authState = useSelector(selectAuthState);
  const router = useRouter();

  useEffect(() => {
    (!authState || !authState.jwt) && router.push('/signup');
  }, []);

  return (
    <Layout initialized>{authState && authState.jwt && <Connect />}</Layout>
  );
}
