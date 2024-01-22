import { useState } from 'react';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LogoutIcon from '@mui/icons-material/Logout';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import QueueIcon from '@mui/icons-material/Queue';
import { Divider, IconButton, Menu, MenuItem } from '@mui/material';
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
import {
  addWallet,
  resetWallet,
  selectWalletState,
} from '@/store/slice/zkWalletSlice';

import { useContextApi } from '../api';
import { utils } from '../api/utils';
import { Apple } from '../dialog/selectProvider/icons/apple';
import { Facebook } from '../dialog/selectProvider/icons/facebook';
import { Google } from '../dialog/selectProvider/icons/google';
import { Kakao } from '../dialog/selectProvider/icons/kakao';
import { Slack } from '../dialog/selectProvider/icons/slack';
import { Twitch } from '../dialog/selectProvider/icons/twitch';
import { WarningModal } from '../dialog/warning';

export const WalletSelecter = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const wallet = useCurrentWallet();
  const { mutate: disconnect } = useDisconnectWallet();
  const authState = useSelector(selectAuthState);
  const { index, selected } = useSelector(selectWalletState);

  const { jwt, wallet: api } = useContextApi();

  const [loading, setLoading] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<undefined | HTMLElement>(undefined);
  const open = Boolean(anchorEl);

  const handleAdd = async () => {
    try {
      if (authState && authState.jwt) {
        setLoading(true);

        const path = getZkPath(authState.network, index);
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
        dispatch(
          addWallet({
            path,
            address,
            proof,
          }),
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setAnchorEl(undefined);
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
    setAnchorEl(undefined);
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
          <IconButton
            size="small"
            onClick={(event) => {
              setAnchorEl(event.currentTarget);
            }}
            sx={{
              marginLeft: 1,
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: 'white',
              },
            }}
          >
            {authState?.provider === 'apple' && <Apple />}
            {authState?.provider === 'facebook' && <Facebook />}
            {authState?.provider === 'google' && <Google />}
            {authState?.provider === 'kakao' && <Kakao />}
            {authState?.provider === 'slack' && <Slack />}
            {authState?.provider === 'twitch' && <Twitch />}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(undefined)}
          >
            <MenuItem
              disabled={loading}
              onClick={() => {
                authState &&
                  authState.email &&
                  navigator.clipboard.writeText(authState.email);
                setAnchorEl(undefined);
              }}
            >
              <ContentCopyIcon fontSize="small" sx={{ marginRight: 1 }} />
              {utils.shortenString(authState?.email || '', 8, 5)}
            </MenuItem>
            <Divider />
            <MenuItem disabled={true} onClick={handleAdd}>
              <QueueIcon fontSize="small" sx={{ marginRight: 1 }} />
              Add Wallet
            </MenuItem>
            <MenuItem disabled={loading} onClick={handleRefresh}>
              <MoreTimeIcon fontSize="small" sx={{ marginRight: 1 }} />
              Extend Epoch
            </MenuItem>
            <MenuItem
              disabled={loading}
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
