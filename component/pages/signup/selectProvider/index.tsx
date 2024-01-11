import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Fade,
  Grid,
  Typography,
} from '@mui/material';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useDispatch, useSelector } from 'react-redux';

import { useContextApi } from '@/component/api';
import Layout from '@/component/layout';
import { selectAuthState, setAuthState } from '@/store/slice/authSlice';
import { DEFAULT_NETWORK, REDIRECT_AUTH_URL } from '@/store/slice/config';

import type { PROVIDER } from '@/store/slice/config';

const BUTTONS: { name: PROVIDER; src: string; disabled: boolean }[] = [
  {
    name: 'google',
    src: '/images/provider/google.svg',
    disabled: false,
  },
  {
    name: 'apple',
    src: '/images/provider/apple.svg',
    disabled: true,
  },
  {
    name: 'facebook',
    src: '/images/provider/facebook.svg',
    disabled: true,
  },
  {
    name: 'twitch',
    src: '/images/provider/twitch.svg',
    disabled: true,
  },
  {
    name: 'slack',
    src: '/images/provider/slack.svg',
    disabled: true,
  },
  {
    name: 'kakao',
    src: '/images/provider/kakao.svg',
    disabled: true,
  },
];

export const SelectProviderPage = () => {
  const authState = useSelector(selectAuthState);
  const dispatch = useDispatch();
  const { jwt } = useContextApi();

  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const account = useCurrentAccount();

  const handleClick = async (provider: PROVIDER) => {
    setLoading(true);
    if (account) {
      const { url, randomness, maxEpoch, crypto, publicKey } =
        await jwt.sui.getOAuthURL({
          provider,
          redirectUrl: REDIRECT_AUTH_URL,
          network: DEFAULT_NETWORK,
          publicKey: `0x${Buffer.from(account.publicKey).toString('hex')}`,
        });
      dispatch(
        setAuthState({
          provider,
          network: DEFAULT_NETWORK,
          maxEpoch,
          randomness,
          key: {
            type: 'extension',
            crypto,
            publicKey,
          },
        }),
      );
      window.location.replace(url);
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
        {account && (
          <Box width="400px" marginTop={-20}>
            <Fade in={account && show}>
              <Card sx={{ minWidth: 275 }}>
                <CardHeader title="Sign Up" />
                <CardContent>
                  <Grid container spacing={2}>
                    {BUTTONS.map((item, key) => (
                      <Grid item key={key} xs={6}>
                        <Button
                          fullWidth
                          disableRipple
                          onClick={() => handleClick(item.name)}
                          disabled={
                            item.disabled || !!authState || loading
                          }
                          startIcon={<img src={item.src} />}
                          sx={{
                            color: 'black',
                            opacity: item.disabled ? 0.5 : 1,
                            backgroundColor: 'white',
                            '&:hover': {
                              color: 'white',
                            },
                          }}
                        >
                          <Typography
                            alignSelf="center"
                            variant="body2"
                            textTransform="capitalize"
                            style={{
                              fontWeight: 600,
                            }}
                          >
                            {item.name}
                          </Typography>
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Fade>
          </Box>
        )}
      </Box>
    </Layout>
  );
};
