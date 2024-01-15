import { useEffect, useState } from 'react';

import SelectProviderModal from '@/component/dialog/selectProvider';
import {
  CLIENT_ID,
  DEFAULT_NETWORK,
  MAX_EPOCH_DURATION,
  REDIRECT_AUTH_URL,
} from '@/store/slice/config';

export const Signup = () => {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 300);
  });

  return (
    <>
      {show && (
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
