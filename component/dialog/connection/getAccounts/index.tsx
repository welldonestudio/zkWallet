import { Button, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@/component/theme/component';
import { selectWalletState } from '@/store/slice/zkWalletSlice';

export const GetAccountsModal = ({
  callback,
  method,
  id,
  open,
  onClose,
}: {
  callback: string;
  method: string;
  params?: any[] | { [key: string]: any };
  id: number;
  open: boolean;
  onClose: () => void;
}) => {
  const { selected } = useSelector(selectWalletState);

  const handleConfirm = () => {
    const url = new URL(callback);
    url.searchParams.set(
      'jsonrpc',
      JSON.stringify(
        selected
          ? {
              jsonrpc: '2.0',
              id,
              result: [selected],
            }
          : {
              jsonrpc: '2.0',
              id,
              error: {
                code: -32603,
                message: 'account is not exist.',
              },
            },
      ),
    );
    window.location.href = url.toString();
    onClose();
  };

  const handleReject = () => {
    const url = new URL(callback);
    url.searchParams.set(
      'jsonrpc',
      JSON.stringify({
        jsonrpc: '2.0',
        id,
        error: {
          code: -32603,
          message: 'rejected',
        },
      }),
    );
    window.location.href = url.toString();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleReject} fullWidth maxWidth="sm">
      <DialogTitle>{method}</DialogTitle>
      <DialogContent>
        <Typography variant="caption">{selected}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm}>Excute</Button>
      </DialogActions>
    </Dialog>
  );
};
