import { useState } from 'react';

import { Button, Stack, TextField } from '@mui/material';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@/component/theme/component';

export default function SendTokenModal({
  open,
  onClose,
  confirm,
}: {
  open: boolean;
  onClose: () => void;
  confirm: (password: string, to: string, amount: string) => void;
}) {
  const [to, setTo] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleConfirm = () => {
    confirm(password, to, amount);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Set Password</DialogTitle>
      <DialogContent>
        <Stack>
          <TextField
            fullWidth
            variant="standard"
            label="To"
            onChange={(e) => {
              setTo(e.target.value);
            }}
          />
          <TextField
            fullWidth
            variant="standard"
            label="Amount"
            type="number"
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />
          <TextField
            fullWidth
            variant="standard"
            label="Password"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={!password} onClick={handleConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
