import { Wallet, selectWalletState } from '@/store/slice/zkWalletSlice';
import { MenuItem, TextField } from '@mui/material';
import { useSelector } from 'react-redux';

export const WalletSelecter = () => {
  const { wallets }: { index: number; wallets: Wallet[] } =
    useSelector(selectWalletState);

  return (
    <>
      {wallets.length > 0 && (
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
