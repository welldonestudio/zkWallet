import { useEffect, useState } from 'react';

import { useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { WarningModal } from '@/component/dialog/warning';
import Layout from '@/component/layout';
import { Wallet } from '@/component/pages/wallet';
import { selectAuthState, setAuthState } from '@/store/slice/authSlice';
import { resetWallet } from '@/store/slice/zkWalletSlice';

export default function HomePage() {
  const router = useRouter();
  const authState = useSelector(selectAuthState);
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const dispatch = useDispatch();

  const [init, setInit] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);

  const reConnect = () => {
    disconnect();
    dispatch(setAuthState(undefined));
    dispatch(resetWallet());
    router.push('/signup');
  };

  useEffect(() => {
    if (!authState || !authState.jwt) {
      router.push('/signup');
    }
    setOpen(!account);
    setInit(init + 1);
  }, [account]);

  return (
    <Layout breadcrumbs={[]} actions={<></>} initialized>
      {authState && authState.jwt && <Wallet />}
      {init > 0 && (
        <WarningModal
          title="error"
          desc="Connection expired"
          button="OK"
          open={open}
          onClose={reConnect}
        />
      )}
    </Layout>
  );
}
