import { useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  SvgIcon,
  Typography,
} from '@mui/material';
import { useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';
import { useDispatch, useSelector } from 'react-redux';

import { useContextApi } from '@/component/api';
import { selectAuthState, setAuthState } from '@/store/slice/authSlice';
import { resetWallet } from '@/store/slice/zkWalletSlice';

import { Apple } from './icons/apple';
import { Facebook } from './icons/facebook';
import { Google } from './icons/google';
import { Kakao } from './icons/kakao';
import { Slack } from './icons/slack';
import { Twitch } from './icons/twitch';

import type { NETWORK, PROVIDER } from '@/store/slice/config';

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

export const SelectProviderModal = ({
  open,
  network,
  duration,
  redirectUrl,
  clientIds,
}: {
  open: boolean;
  network: NETWORK;
  duration: number;
  redirectUrl: string;
  clientIds: { [key: string]: string };
}) => {
  const authState = useSelector(selectAuthState);
  const { mutate: disconnect } = useDisconnectWallet();
  const account = useCurrentAccount();

  const dispatch = useDispatch();
  const { jwt } = useContextApi();

  const [loading, setLoading] = useState<boolean>(false);

  const handleDisconnect = () => {
    disconnect();
    dispatch(setAuthState(undefined));
    dispatch(resetWallet());
  };

  const handleClick = async (provider: PROVIDER) => {
    setLoading(true);
    if (account) {
      const { url, randomness, maxEpoch, crypto, publicKey } =
        await jwt.sui.getOAuthURL({
          provider,
          redirectUrl,
          network,
          duration,
          publicKey: `0x${Buffer.from(account.publicKey).toString('hex')}`,
          clientId: clientIds[provider],
        });
      dispatch(
        setAuthState({
          provider,
          network,
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
                disabled={!clientIds[item.name] || !!authState || loading}
                startIcon={<SvgIcon>{item.icon}</SvgIcon>}
                sx={{
                  color: 'black',
                  opacity: !clientIds[item.name] ? 0.5 : 1,
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
      <DialogActions>
        <Button
          fullWidth
          onClick={handleDisconnect}
          variant="outlined"
          color="error"
        >
          Disconnect Wallet
        </Button>
      </DialogActions>
    </Dialog>
  );
};
