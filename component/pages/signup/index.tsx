import { useEffect, useState } from 'react';

import { ConnectModal, useCurrentAccount } from '@mysten/dapp-kit';
import { useSelector } from 'react-redux';

import SelectProviderModal from '@/component/dialog/selectProvider';
import Layout from '@/component/layout';
import { CLIENT_ID, MAX_EPOCH, REDIRECT_AUTH_URL } from '@/store/slice/config';
import { selectWalletState } from '@/store/slice/zkWalletSlice';

export const SignupPage = () => {
  const account = useCurrentAccount();
  const { selected } = useSelector(selectWalletState);

  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  });

  return (
    <Layout breadcrumbs={[]} actions={<></>} initialized>
      {show && (
        <ConnectModal
          open={!(account || selected)}
          trigger={<></>}
          onOpenChange={() => {}}
        />
      )}
      {show && (
        <SelectProviderModal
          open
          maxEpoch={MAX_EPOCH}
          redirectUrl={REDIRECT_AUTH_URL}
          providerIds={CLIENT_ID}
        />
      )}
    </Layout>
  );
};
