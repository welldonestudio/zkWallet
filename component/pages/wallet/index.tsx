import Layout from '@/component/layout';
import { selectWalletState } from '@/store/slice/zkWalletSlice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export const WalletPage = () => {
  const walletState = useSelector(selectWalletState);

  useEffect(() => {
    walletState.length === 0;
  }, []);

  return (
    <Layout breadcrumbs={[]} actions={<></>} initialized>
      <></>
    </Layout>
  );
};
