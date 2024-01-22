import { useState } from 'react';

import LogoutIcon from '@mui/icons-material/Logout';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { useCurrentWallet, useDisconnectWallet } from '@mysten/dapp-kit';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { selectAuthState, setAuthState } from '@/store/slice/authSlice';
import {
  CLIENT_ID,
  getZkPath,
  MAX_EPOCH_DURATION,
  REDIRECT_AUTH_URL,
} from '@/store/slice/config';
import { resetWallet, selectWalletState } from '@/store/slice/zkWalletSlice';

import { useContextApi } from '../api';
import { WarningModal } from '../dialog/warning';

import type { Wallet } from '@/store/slice/zkWalletSlice';

export const WalletSelecter = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const wallet = useCurrentWallet();
  const { mutate: disconnect } = useDisconnectWallet();
  const authState = useSelector(selectAuthState);
  const { index, selected, wallets } = useSelector(selectWalletState);

  const { jwt, wallet: api } = useContextApi();

  const [loading, setLoading] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<undefined | HTMLElement>(undefined);
  const open = Boolean(anchorEl);

  const handleAdd = async () => {
    try {
      if (authState && authState.jwt) {
        setLoading(true);

        const path = getZkPath(authState.network, index); // TODO
        const address = await api.getAddress({
          network: authState.network,
          jwt: authState.jwt,
          path,
        });
        const proof = await jwt.sui.getZkProof({
          network: authState.network,
          jwt: authState.jwt,
          publicKey: authState.key.publicKey,
          maxEpoch: authState.maxEpoch,
          randomness: authState.randomness,
          path,
        });
        // TODO
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (authState) {
      switch (authState.provider) {
        case 'google':
          {
            const { url, maxEpoch } = await jwt.sui.getOAuthURL({
              provider: authState.provider,
              redirectUrl: REDIRECT_AUTH_URL,
              network: authState.network,
              publicKey: authState.key.publicKey,
              randomness: authState.randomness,
              clientId: CLIENT_ID[authState.provider],
              duration: MAX_EPOCH_DURATION,
            });

            dispatch(
              setAuthState({
                ...authState,
                maxEpoch,
                jwt: undefined,
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

  const handleSignOut = () => {
    disconnect();
    dispatch(setAuthState(undefined));
    dispatch(resetWallet());
    router.push('/signup');
  };

  return (
    <>
      {!!selected && (
        <>
          <Typography>{authState?.email}</Typography>
          <IconButton
            size="small"
            onClick={(event) => {
              setAnchorEl(event.currentTarget);
            }}
            sx={{ marginLeft: 1 }}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(undefined)}
          >
            <MenuItem onClick={handleRefresh}>
              <MoreTimeIcon fontSize="small" sx={{ marginRight: 1 }} />
              Refrash
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAnchorEl(undefined);
                handleSignOut();
              }}
            >
              <LogoutIcon fontSize="small" sx={{ marginRight: 1 }} />
              Sign Out
            </MenuItem>
          </Menu>
        </>
      )}
      <WarningModal
        title="error"
        desc="Connection expired"
        button="OK"
        open={
          wallet.connectionStatus === 'disconnected' &&
          !!authState &&
          !!authState.jwt
        }
        onClose={handleSignOut}
      />
    </>
  );
};
