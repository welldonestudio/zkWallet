import { useEffect, useState } from 'react';

import { decodeJwt } from 'jose';
import { useRouter } from 'next/router';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';

import { useContextApi } from '@/component/api';
import { WarningModal } from '@/component/dialog/warning';
import { selectAuthState, setAuthState } from '@/store/slice/authSlice';
import { getZkPath } from '@/store/slice/config';
import { addWallet, resetWallet } from '@/store/slice/zkWalletSlice';

export const SignUpCallback = () => {
  const authState = useSelector(selectAuthState);
  const dispatch = useDispatch();
  const router = useRouter();
  const { jwt, wallet } = useContextApi();

  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleClear = () => {
    setLoading(true);
    dispatch(setAuthState(undefined));
    dispatch(resetWallet());
    router.push('/');
  };

  useEffect(() => {
    try {
      const createWallet = async (id_token: string) => {
        if (authState) {
          const path = getZkPath(authState.network, 0);
          const address = await wallet.getAddress({
            network: authState.network,
            jwt: id_token,
            path,
          });
          const proof = await jwt.sui.getZkProof({
            network: authState.network,
            jwt: id_token,
            publicKey: authState.key.publicKey,
            maxEpoch: authState.maxEpoch,
            randomness: authState.randomness,
            path,
          });
          dispatch(resetWallet());
          dispatch(
            addWallet({
              path,
              address,
              proof,
            }),
          );
        }
        router.push('/');
      };

      if (authState) {
        const { id_token } = queryString.parse(location.hash);
        const { email, picture } = decodeJwt(id_token as string);
        dispatch(
          setAuthState({
            ...authState,
            jwt: id_token as string,
            email: email as string,
            picture: picture as string,
          }),
        );
        createWallet(id_token as string);
      }
    } catch (err) {
      console.log(err);
      setTimeout(() => setError(true), 500);
    }
  }, [location]);

  return (
    <WarningModal
      title="Error"
      desc="Callback Token Error"
      open={error && !loading}
      onClose={handleClear}
    />
  );
};
