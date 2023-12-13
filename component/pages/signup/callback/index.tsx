import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Fade,
  Tooltip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { decodeJwt } from 'jose';
import queryString from 'query-string';
import Layout from '@/component/layout';
import { selectAuthState, setAuthState } from '@/store/slice/authSlice';
import { useEffect, useState } from 'react';
import { useContextApi } from '@/component/api';
import { DEFAULT_NETWORK, REDIRECT_AUTH_URL } from '@/store/slice/config';
import {
  Wallet,
  addWallet,
  resetWallet,
  selectWalletState,
} from '@/store/slice/zkWalletSlice';

export const SignUpCallbackPage = () => {
  const authState = useSelector(selectAuthState);
  const walletState: { index: number; wallets: Wallet[] } =
    useSelector(selectWalletState);
  const dispatch = useDispatch();
  const router = useRouter();
  const { jwt, wallet, utils } = useContextApi();

  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleClear = () => {
    setLoading(true);
    dispatch(setAuthState(undefined));
    dispatch(resetWallet());
    router.push('/');
  };

  const handleRestore = async () => {
    const { publicKey, privateKey } = utils.keyPair.ed25519();
    switch (authState.provider) {
      case 'google':
        {
          setLoading(true);
          const { url, randomness, maxEpoch } = await jwt.sui.getLoginURL({
            provider: authState.provider,
            redirectUrl: REDIRECT_AUTH_URL,
            network: DEFAULT_NETWORK,
            crypto: 'ed25519',
            publicKey,
          });
          dispatch(
            setAuthState({
              provider: authState.provider,
              network: DEFAULT_NETWORK,
              maxEpoch,
              randomness,
              key: { publicKey, privateKey, crypto: 'ed25519' } as any, // TODO
            }),
          );
          window.location.replace(url);
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    try {
      const createWallet = async (id_token: string) => {
        if (walletState.wallets.length === 0) {
          const PATH = 'zkWallet/0'; // temp
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
      setTimeout(() => setError(true), 300);
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
                <CardHeader title={`Sign Up (${authState.provider})`} />
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
                          Clear
                        </Button>
                      </span>
                    </Tooltip>
                    <Tooltip title="Restore Wallet">
                      <span>
                        <Button onClick={handleRestore} disabled={loading}>
                          Restore
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
