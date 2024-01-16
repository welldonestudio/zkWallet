import { useEffect, useState } from 'react';

import {
  ConnectModal,
  useCurrentAccount,
  useDisconnectWallet,
} from '@mysten/dapp-kit';
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

  const HandleWarningModal = () => {
    disconnect();
    dispatch(setAuthState(undefined));
    dispatch(resetWallet());
  };

  useEffect(() => {
    setTimeout(() => setShow(true), 300);
  }, []);

  return (
    <>
      <ConnectModal
        open={show && !account}
        trigger={<></>}
        onOpenChange={() => {}}
      />
      <SelectProviderModal
        open={show && !!account && !!account.publicKey}
        duration={MAX_EPOCH_DURATION}
        redirectUrl={REDIRECT_AUTH_URL}
        clientIds={CLIENT_ID}
        network={DEFAULT_NETWORK}
      />
      <WarningModal
        open={show && !!account && !account.publicKey}
        title="Wallet error"
        desc="Invalid Account (public key error)"
        onClose={HandleWarningModal}
      />
    </>
  );
};
