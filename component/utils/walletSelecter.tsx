import { useState } from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LogoutIcon from '@mui/icons-material/Logout';
import { Box, IconButton, MenuItem, TextField, Tooltip } from '@mui/material';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { selectAuthState, setAuthState } from '@/store/slice/authSlice';
import { ZKPATH_PREFIX } from '@/store/slice/config';
import { resetWallet, selectWalletState } from '@/store/slice/zkWalletSlice';

import { useContextApi } from '../api';

import type { Wallet } from '@/store/slice/zkWalletSlice';

export const WalletSelecter = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const authState = useSelector(selectAuthState);
  const {
    index,
    selected,
    wallets,
  }: { index: number; selected: string; wallets: Wallet[] } =
    useSelector(selectWalletState);

  const { jwt, wallet } = useContextApi();

  const [loading, setLoading] = useState<boolean>(false);

  const handleAdd = async () => {
    try {
      setLoading(true);

      const PATH = `${ZKPATH_PREFIX}:${authState.network}:${index}`;
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
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
            disabled={loading}
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
          <Tooltip title="copy address">
            <IconButton
              sx={{ marginLeft: 1 }}
              size="small"
              onClick={() => {
                navigator.clipboard.writeText(wallets[0].address);
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="logout">
            <IconButton
              sx={{ marginLeft: 1 }}
              size="small"
              onClick={() => {
                dispatch(setAuthState(undefined));
                dispatch(resetWallet());
                router.push('/');
              }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      )}
    </>
  );
};
