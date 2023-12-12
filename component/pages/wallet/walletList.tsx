import { Wallet, selectWalletState } from '@/store/slice/zkWalletSlice';
import { MenuItem, TextField } from '@mui/material';
import { useSelector } from 'react-redux';

export const WalletList = () => {
  const { wallets }: { index: number; wallets: Wallet[] } =
    useSelector(selectWalletState);

  return (
    <>
      {wallets.length > 0 && (
        <TextField
          select
          label="Wallet"
          defaultValue={`${wallets[0].address}:${wallets[0].path}`}
        >
          {wallets.map((item: Wallet, key) => (
            <MenuItem key={key} value={`${item.address}:${item.path}`}>
              {item.address}
            </MenuItem>
          ))}
        </TextField>
      )}
    </>
  );
};
