import { useEffect, useState } from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  SvgIcon,
  Typography,
} from '@mui/material';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useDispatch, useSelector } from 'react-redux';

import { useContextApi } from '@/component/api';
import { selectAuthState, setAuthState } from '@/store/slice/authSlice';
import { DEFAULT_NETWORK, REDIRECT_AUTH_URL } from '@/store/slice/config';

import { Apple } from './icons/apple';
import { Facebook } from './icons/facebook';
import { Google } from './icons/google';
import { Kakao } from './icons/kakao';
import { Slack } from './icons/slack';
import { Twitch } from './icons/twitch';

import type { PROVIDER } from '@/store/slice/config';

const BUTTONS: { name: PROVIDER; icon: React.ReactNode }[] = [
  {
    name: 'apple',
    icon: <Apple />,
  },
  {
    name: 'facebook',
    icon: <Facebook />,
  },
  {
    name: 'google',
    icon: <Google />,
  },
  {
    name: 'kakao',
    icon: <Kakao />,
  },
  {
    name: 'slack',
    icon: <Slack />,
  },
  {
    name: 'twitch',
    icon: <Twitch />,
  },
];

export default function SelectProviderModal({
  open,
  maxEpoch,
  redirectUrl,
  providerIds,
}: {
  open: boolean;
  maxEpoch: number;
  redirectUrl: string;
  providerIds: { [key: string]: string };
}) {
  const authState = useSelector(selectAuthState);

  const dispatch = useDispatch();
  const { jwt } = useContextApi();

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

  return (
    <Dialog open={open} maxWidth="xs">
      <DialogTitle>Select Provider</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {BUTTONS.map((item, key) => (
            <Grid item key={key} xs={6}>
              <Button
                fullWidth
                disableRipple
                onClick={() => handleClick(item.name)}
                disabled={
                  !providerIds ||
                  !providerIds[item.name] ||
                  !!authState ||
                  loading
                }
                startIcon={<SvgIcon>{item.icon}</SvgIcon>}
                sx={{
                  color: 'black',
                  opacity: !providerIds || !providerIds[item.name] ? 0.5 : 1,
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
      </DialogContent>
    </Dialog>
  );
}
