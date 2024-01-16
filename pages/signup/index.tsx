import { useEffect } from 'react';

import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import Layout from '@/component/layout';
import { Signup } from '@/component/pages/signup';
import { SignUpCallback } from '@/component/pages/signup/callback';
import { selectAuthState } from '@/store/slice/authSlice';

export default function SignUpPage() {
  const authState = useSelector(selectAuthState);
  const router = useRouter();

  useEffect(() => {
    authState && authState.jwt && router.push('/');
  }, [authState]);

  return (
    <Layout breadcrumbs={[]} actions={<></>} initialized>
      {!authState && <Signup />}
      {authState && !authState.jwt && <SignUpCallback />}
    </Layout>
  );
}
