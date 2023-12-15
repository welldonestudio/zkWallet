import { useState } from 'react';

import { Button, Stack, TextField } from '@mui/material';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@/component/theme/component';

export default function NewPasswordModal({
  open,
  onClose,
  confirm,
}: {
  open: boolean;
  onClose: () => void;
  confirm: (password: string) => void;
}) {
  const [password, setPassword] = useState<string>('');
  const [password2, setPassword2] = useState<string>('');

  const handleConfirm = () => {
    confirm(password);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Set Password</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField
            fullWidth
            variant="standard"
            label="Password"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <TextField
            fullWidth
            variant="standard"
            label="Confirm Password"
            type="password"
            onChange={(e) => {
              setPassword2(e.target.value);
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={!password || password !== password2}
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
