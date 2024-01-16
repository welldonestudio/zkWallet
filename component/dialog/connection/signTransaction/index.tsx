import { useState } from 'react';

import { Button, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

import { useContextApi } from '@/component/api';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@/component/theme/component';
import { selectAuthState } from '@/store/slice/authSlice';
import { selectWalletState } from '@/store/slice/zkWalletSlice';

import type { ResponseSignTx } from '@/component/api/types';

export const SignTransactionModal = ({
  callback,
  method,
  params,
  id,
  open,
  onClose,
}: {
  callback: string;
  method: string;
  params?: any[] | { [key: string | number]: any };
  id: number;
  open: boolean;
  onClose: () => void;
}) => {
  const { wallet } = useContextApi();
  const authState = useSelector(selectAuthState);
  const { selected, wallets } = useSelector(selectWalletState);

  const [loading, setLoading] = useState<boolean>(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const url = new URL(callback);
      if (!params || !params[0]) {
        url.searchParams.set(
          'jsonrpc',
          JSON.stringify({
            jsonrpc: '2.0',
            id,
            error: {
              code: -32603,
              message: `params error (${params})`,
            },
          }),
        );
      } else {
        const res: ResponseSignTx | undefined =
        authState &&
        (await wallet.signTransaction({
          auth: authState,
          wallet: wallets[0],
          unsignedTx: params[0].unsignedTx,
        }));

        url.searchParams.set(
          'jsonrpc',
          JSON.stringify({
            jsonrpc: '2.0',
            id,
            result: [{
              ...res
            }],
          }),
        );
      }
      // window.location.href = url.toString();
    } catch (error) {
      const url = new URL(callback);
      url.searchParams.set(
        'jsonrpc',
        JSON.stringify({
          jsonrpc: '2.0',
          id,
          error: {
            code: -32603,
            message: `error (${error})`,
          },
        }),
      );
      // window.location.href = url.toString();
    } finally {
      onClose();
    }
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
        <Typography variant="caption">{selected}</Typography>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={handleConfirm}>
          Excute
        </Button>
      </DialogActions>
    </Dialog>
  );
};
