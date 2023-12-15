import { useState } from 'react';

import { Button, Stack, TextField } from '@mui/material';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@/component/theme/component';

export default function AskPasswordModal({
  open,
  onClose,
  confirm,
}: {
  open: boolean;
  onClose: () => void;
  confirm: (password: string) => void;
}) {
  const [password, setPassword] = useState<string>('');

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
