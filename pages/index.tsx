import { useEffect } from 'react';

import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { WalletPage } from '@/component/pages/wallet';
import { selectAuthState } from '@/store/slice/authSlice';

export default function HomePage() {
  const authState = useSelector(selectAuthState);
  const router = useRouter();

  useEffect(() => {
    (!authState || !authState.jwt) && router.push('/signup');
  }, []);

  return <>{authState && authState.jwt && <WalletPage />}</>;
}
