import { useEffect } from 'react';

import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { Connect } from '@/component/pages/connect';
import { selectAuthState } from '@/store/slice/authSlice';

export default function ConnectPage() {
  const authState = useSelector(selectAuthState);
  const router = useRouter();

  useEffect(() => {
    (!authState || !authState.jwt) && router.push('/signup');
  }, []);

  return <>{authState && authState.jwt && <Connect />}</>;
}
