import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Fade,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '@/component/layout';
import { useContextApi } from '@/component/api';
import { selectAuthState, setAuthState } from '@/store/slice/authSlice';
import { useEffect, useState } from 'react';
import { DEFAULT_NETWORK, REDIRECT_AUTH_URL } from '@/store/slice/config';

export const SelectProviderPage = () => {
  const authState = useSelector(selectAuthState);
  const dispatch = useDispatch();
  const { jwt, utils } = useContextApi();

  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleClick = async (provider: string) => {
    if (!authState) {
      const { publicKey, privateKey } = utils.keyPair.ed25519();
      switch (provider) {
        case 'google':
          {
            setLoading(true);
            const { url, randomness, maxEpoch } = await jwt.sui.getLoginURL({
              provider,
              redirectUrl: REDIRECT_AUTH_URL,
              network: DEFAULT_NETWORK,
              crypto: 'ed25519',
              publicKey,
            });
            dispatch(
              setAuthState({
                provider,
                network: DEFAULT_NETWORK,
                maxEpoch,
                randomness,
                key: {
                  type: 'local',
                  crypto: 'ed25519',
                  publicKey,
                  privateKey,
                } as any, // TODO
              }),
            );
            window.location.replace(url);
          }
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    setTimeout(() => setShow(true), 300);
  });

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
        <Box width="400px" marginTop={-20}>
          <Fade in={show}>
            <Card sx={{ minWidth: 275 }}>
              <CardHeader title="Sign Up" />
              <CardContent>
                <Button
                  fullWidth
                  onClick={() => handleClick('google')}
                  disabled={loading}
                >
                  Google
                </Button>
                <Button
                  fullWidth
                  onClick={() => handleClick('facebook')}
                  disabled
                >
                  Facebook
                </Button>
                <Button
                  fullWidth
                  onClick={() => handleClick('twitch')}
                  disabled
                >
                  Twitch
                </Button>
                <Button fullWidth onClick={() => handleClick('slack')} disabled>
                  Slack
                </Button>
                <Button fullWidth onClick={() => handleClick('kakao')} disabled>
                  Kakao
                </Button>
                <Button fullWidth onClick={() => handleClick('apple')} disabled>
                  Apple
                </Button>
              </CardContent>
            </Card>
          </Fade>
        </Box>
      </Box>
    </Layout>
  );
};
