import { useEffect, useState } from 'react';

import { useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';
import { useDispatch } from 'react-redux';

import { SelectProviderModal } from '@/component/dialog/selectProvider';
import { WarningModal } from '@/component/dialog/warning';
import { setAuthState } from '@/store/slice/authSlice';
import {
  CLIENT_ID,
  DEFAULT_NETWORK,
  MAX_EPOCH_DURATION,
  REDIRECT_AUTH_URL,
} from '@/store/slice/config';
import { resetWallet } from '@/store/slice/zkWalletSlice';

export const Signup = () => {
  const dispatch = useDispatch();
  const { mutate: disconnect } = useDisconnectWallet();

  const account = useCurrentAccount();
  const [show, setShow] = useState<boolean>(false);
  const [warningOpen, setWarningOpen] = useState<boolean>(false);

  const HandleWarningModal = () => {
    disconnect();
    dispatch(setAuthState(undefined));
    dispatch(resetWallet());
    setWarningOpen(false);
  };

  useEffect(() => {
    setTimeout(() => setShow(true), 300);
  }, []);

  return (
    <>
      {account && account.publicKey && show && (
        <SelectProviderModal
          open
          duration={MAX_EPOCH_DURATION}
          redirectUrl={REDIRECT_AUTH_URL}
          clientIds={CLIENT_ID}
          network={DEFAULT_NETWORK}
        />
      )}
      {account && !account.publicKey && show && (
        <WarningModal
          open={warningOpen}
          title="Wallet error"
          desc="Invalid Account (public key error)"
          onClose={HandleWarningModal}
        />
      )}
      {JSON.stringify(account)}
    </>
  );
};
