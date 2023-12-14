import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton, MenuItem, TextField, Tooltip } from '@mui/material';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { setAuthState } from '@/store/slice/authSlice';
import { resetWallet, selectWalletState } from '@/store/slice/zkWalletSlice';

import type { Wallet } from '@/store/slice/zkWalletSlice';

export const WalletSelecter = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { wallets }: { index: number; wallets: Wallet[] } =
    useSelector(selectWalletState);

  const handleAdd = () => {
    //
  };

  return (
    <>
      {wallets && wallets.length > 0 && (
        <>
          <TextField
            select
            size="small"
            label="Wallet"
            defaultValue={`${wallets[0].network}:${wallets[0].address}`}
            sx={{ maxWidth: '200px' }}
          >
            {wallets.map((item: Wallet, key) => (
              <MenuItem key={key} value={`${item.network}:${item.address}`}>
                {item.address}
              </MenuItem>
            ))}
            <MenuItem onClick={handleAdd}>
              <AddCircleOutlineIcon sx={{ marginRight: 1 }} />
              Add
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
