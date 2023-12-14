
import { MenuItem, TextField } from '@mui/material';
import { useSelector } from 'react-redux';

import { selectWalletState } from '@/store/slice/zkWalletSlice';

import type { Wallet} from '@/store/slice/zkWalletSlice';

export const WalletSelecter = () => {
  const { wallets }: { index: number; wallets: Wallet[] } =
    useSelector(selectWalletState);

  return (
    <>
      {wallets && wallets.length > 0 && (
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
        </TextField>
      )}
    </>
  );
};
