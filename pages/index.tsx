import { useEffect } from 'react';

import { useCurrentAccount, useCurrentWallet } from '@mysten/dapp-kit';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { WalletPage } from '@/component/pages/wallet';
import { selectAuthState } from '@/store/slice/authSlice';

export default function HomePage() {
  const authState = useSelector(selectAuthState);
  const router = useRouter();

  const { currentWallet } = useCurrentWallet();
	const currentAccount = useCurrentAccount();

  useEffect(() => {
    console.log(1, currentWallet);
    console.log(2, currentAccount);
  
    (!authState || !authState.jwt) && router.push('/signup');
  }, []);

  return <>{authState && authState.jwt && <WalletPage />}</>;
}
