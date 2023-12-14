import { useEffect } from 'react';

import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { SignUpCallbackPage } from '@/component/pages/signup/callback';
import { SelectProviderPage } from '@/component/pages/signup/selectProvider';
import { selectAuthState } from '@/store/slice/authSlice';

export default function SignUpPage() {
  const authState = useSelector(selectAuthState);
  const router = useRouter();

  useEffect(() => {
    authState && authState.jwt && router.push('/');
  }, [authState]);

  return (
    <>
      {!authState && <SelectProviderPage />}
      {authState && !authState.jwt && <SignUpCallbackPage />}
    </>
  );
}
