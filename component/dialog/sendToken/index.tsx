import { useState } from 'react';

import SendIcon from '@mui/icons-material/Send';
import { Button, Stack, TextField } from '@mui/material';
import { useSelector } from 'react-redux';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@/component/theme/component';
import { selectAuthState } from '@/store/slice/authSlice';

export default function SendTokenModal({
  title,
  open,
  onClose,
  confirm,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  confirm: (password: string, to: string, amount: string) => void;
}) {
  const authState = useSelector(selectAuthState);

  const [to, setTo] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleConfirm = () => {
    confirm(password, to, amount);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField
            fullWidth
            variant="standard"
            autoComplete="off"
            label="To"
            onChange={(e) => {
              setTo(e.target.value);
            }}
          />
          <TextField
            fullWidth
            variant="standard"
            autoComplete="off"
            label="Amount"
            type="number"
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />
          {authState?.key.type === 'local' && (
            <TextField
              fullWidth
              variant="standard"
              label="Password"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          )}{' '}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={
            (!password && authState?.key.type === 'local') || !to || !amount
          }
          onClick={handleConfirm}
        >
          <SendIcon fontSize="small" sx={{ marginRight: 1 }} />
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}
