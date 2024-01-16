import { useState } from 'react';

import SendIcon from '@mui/icons-material/Send';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';

import { utils } from '@/component/api/utils';

import type { ResponseValidator } from '@/component/api/types';

export const SendTokenModal = ({
  title,
  open,
  onClose,
  confirm,
  validators,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  confirm: (to: string, amount: string) => void;
  validators?: ResponseValidator[];
}) => {
  const [to, setTo] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const handleConfirm = () => {
    confirm(to, amount);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          {!validators && (
            <TextField
              fullWidth
              variant="standard"
              autoComplete="off"
              label="To"
              onChange={(e) => {
                setTo(e.target.value);
              }}
            />
          )}
          {validators && (
            <TextField
              select
              fullWidth
              variant="standard"
              autoComplete="off"
              label="Validator"
              onChange={(e) => {
                setTo(e.target.value);
              }}
            >
              {validators.map((item) => (
                <MenuItem key={item.address} value={item.address}>
                  {`${utils.shortenString(item.address, 8, 8)} (${item.apy} %)`}
                </MenuItem>
              ))}
            </TextField>
          )}
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
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={!to || !amount} onClick={handleConfirm}>
          <SendIcon fontSize="small" sx={{ marginRight: 1 }} />
          Excute
        </Button>
      </DialogActions>
    </Dialog>
  );
};
