import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Fade,
  Tooltip,
} from '@mui/material';
import { decodeJwt } from 'jose';
import { useRouter } from 'next/router';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';

import { useContextApi } from '@/component/api';
import Layout from '@/component/layout';
import { selectAuthState, setAuthState } from '@/store/slice/authSlice';
import {
  addWallet,
  resetWallet,
  selectWalletState,
} from '@/store/slice/zkWalletSlice';

import type { Wallet } from '@/store/slice/zkWalletSlice';

export const SignUpCallbackPage = () => {
  const authState = useSelector(selectAuthState);
  const walletState: { index: number; wallets: Wallet[] } =
    useSelector(selectWalletState);
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
        if (walletState.wallets.length === 0) {
          const PATH = 'zkWallet/0'; // temp zk://sui:mainnet/0
          const address = await wallet.getAddress({
            network: authState.network,
            jwt: id_token,
            path: PATH,
          });
          const proof = await jwt.sui.getZkProof({
            network: authState.network,
            jwt: id_token,
            publicKey: authState.key.publicKey,
            maxEpoch: authState.maxEpoch,
            randomness: authState.randomness,
            path: PATH,
          });
          dispatch(resetWallet());
          dispatch(
            addWallet({
              network: authState.network,
              path: PATH,
              address,
              proof,
            }),
          );
        }
        router.push('/');
      };

      const { id_token } = queryString.parse(location.hash);
      decodeJwt(id_token as string);
      dispatch(
        setAuthState({
          ...authState,
          jwt: id_token as string,
        }),
      );
      createWallet(id_token as string);
    } catch (err) {
      console.log(err);
      setTimeout(() => setError(true), 500);
    }
  }, [location]);

  return (
    <Layout breadcrumbs={[]} actions={<></>} initialized>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100vh',
        }}
      >
        <Fade in={error}>
          <Box width="400px" marginTop={-20}>
            {error && (
              <Card sx={{ minWidth: 275 }}>
                <CardHeader title="ERROR" />
                <CardContent>Callback Token Error</CardContent>
                <CardActions>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      width: '100%',
                    }}
                  >
                    <Tooltip title="Clear Wallet">
                      <span>
                        <Button onClick={handleClear} disabled={loading}>
                          Reset
                        </Button>
                      </span>
                    </Tooltip>
                  </Box>
                </CardActions>
              </Card>
            )}
          </Box>
        </Fade>
      </Box>
    </Layout>
  );
};
