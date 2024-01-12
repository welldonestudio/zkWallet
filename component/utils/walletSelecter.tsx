import { useState } from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
} from '@mui/material';
import { useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { selectAuthState, setAuthState } from '@/store/slice/authSlice';
import { REDIRECT_AUTH_URL, ZKPATH_PREFIX } from '@/store/slice/config';
import { resetWallet, selectWalletState } from '@/store/slice/zkWalletSlice';

import { useContextApi } from '../api';

import type { Wallet } from '@/store/slice/zkWalletSlice';

export const WalletSelecter = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const authState = useSelector(selectAuthState);
  const { index, selected, wallets } = useSelector(selectWalletState);

  const { jwt, wallet } = useContextApi();

  const [loading, setLoading] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<undefined | HTMLElement>(undefined);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(undefined);
  };

  const handleAdd = async () => {
    try {
      if (authState && authState.jwt) {
        setLoading(true);

        const PATH = `${ZKPATH_PREFIX}:${authState.network}:${index}`; // TODO
        const address = await wallet.getAddress({
          network: authState.network,
          jwt: authState.jwt,
          path: PATH,
        });
        const proof = await jwt.sui.getZkProof({
          network: authState.network,
          jwt: authState.jwt,
          publicKey: authState.key.publicKey,
          maxEpoch: authState.maxEpoch,
          randomness: authState.randomness,
          path: PATH,
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

  return (
    <>
      {!!selected && (
        <>
          <TextField
            select
            size="small"
            label="Wallet"
            defaultValue={selected}
            sx={{ maxWidth: '200px' }}
            disabled={
              !authState || authState.network === 'sui:devnet' || loading
            }
            InputProps={{
              startAdornment: (
                <Tooltip title="Copy Address">
                  <IconButton
                    size="small"
                    sx={{ marginRight: 1 }}
                    onClick={() => {
                      navigator.clipboard.writeText(selected);
                    }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              ),
            }}
          >
            {wallets.map((item: Wallet, key) => (
              <MenuItem key={key} value={item.address}>
                {item.address}
              </MenuItem>
            ))}
            <MenuItem onClick={handleAdd}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <AddCircleOutlineIcon sx={{ marginRight: 1 }} />
                Add
              </Box>
            </MenuItem>
          </TextField>
          <IconButton size="small" onClick={handleClick} sx={{ marginLeft: 1 }}>
            <MenuIcon fontSize="small" />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={handleRefresh}>
              <MoreTimeIcon fontSize="small" sx={{ marginRight: 1 }} />
              Refrash
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                disconnect();
                dispatch(setAuthState(undefined));
                dispatch(resetWallet());
                router.push('/signup');
              }}
            >
              <LogoutIcon fontSize="small" sx={{ marginRight: 1 }} />
              Sign Out
            </MenuItem>
          </Menu>
        </>
      )}
    </>
  );
};
