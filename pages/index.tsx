import { useSelector } from 'react-redux';
import { selectAuthState } from '@/store/slice/authSlice';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { WalletPage } from '@/component/pages/home/wallet';

export default function HomePage() {
  const authState = useSelector(selectAuthState);
  const router = useRouter();

  useEffect(() => {
    (!authState || !authState.jwt) && router.push('/signup');
  }, []);

  return <>{authState && authState.jwt && <WalletPage />}</>;
}
