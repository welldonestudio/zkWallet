import { useEffect } from 'react';

import { useDisconnectWallet } from '@mysten/dapp-kit';
import { useDispatch, useSelector } from 'react-redux';

import Layout from '@/component/layout';
import { Signup } from '@/component/pages/signup';
import { SignUpCallback } from '@/component/pages/signup/callback';
import { selectAuthState, setAuthState } from '@/store/slice/authSlice';
import { resetWallet } from '@/store/slice/zkWalletSlice';

export default function SignUpPage() {
  const dispatch = useDispatch();
  const authState = useSelector(selectAuthState);

  const { mutate: disconnect } = useDisconnectWallet();

  useEffect(() => {
    disconnect();
    dispatch(setAuthState(undefined));
    dispatch(resetWallet());
  }, []);

  return (
    <Layout breadcrumbs={[]} actions={<></>} initialized>
      {!authState && <Signup />}
      {authState && !authState.jwt && <SignUpCallback />}
    </Layout>
  );
}
