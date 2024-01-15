import { useEffect, useState } from 'react';

import { useCurrentAccount } from '@mysten/dapp-kit';

import SelectProviderModal from '@/component/dialog/selectProvider';
import {
  CLIENT_ID,
  DEFAULT_NETWORK,
  MAX_EPOCH_DURATION,
  REDIRECT_AUTH_URL,
} from '@/store/slice/config';

export const Signup = () => {
  const account = useCurrentAccount();
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 300);
  });

  return (
    <>
      {!account && show && (
        <SelectProviderModal
          open
          duration={MAX_EPOCH_DURATION}
          redirectUrl={REDIRECT_AUTH_URL}
          clientIds={CLIENT_ID}
          network={DEFAULT_NETWORK}
        />
      )}
    </>
  );
};
