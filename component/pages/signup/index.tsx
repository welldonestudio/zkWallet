import { useEffect, useState } from 'react';

import { ConnectModal, useCurrentAccount } from '@mysten/dapp-kit';
import { useSelector } from 'react-redux';

import SelectProviderModal from '@/component/dialog/selectProvider';
import Layout from '@/component/layout';
import {
  CLIENT_ID,
  DEFAULT_NETWORK,
  MAX_EPOCH_DURATION,
  REDIRECT_AUTH_URL,
} from '@/store/slice/config';
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
          duration={MAX_EPOCH_DURATION}
          redirectUrl={REDIRECT_AUTH_URL}
          clientIds={CLIENT_ID}
          network={DEFAULT_NETWORK}
        />
      )}
    </Layout>
  );
};
