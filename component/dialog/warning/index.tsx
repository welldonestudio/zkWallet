import { Button } from '@mui/material';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@/component/theme/component';

export const WarningModal = ({
  title,
  desc,
  open,
  onClose,
}: {
  title: string;
  desc: string;
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{desc}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
