import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

export const WarningModal = ({
  title,
  desc,
  button,
  open,
  onClose,
}: {
  title: string;
  desc: string;
  button?: string;
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{desc}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{button || 'Close'}</Button>
      </DialogActions>
    </Dialog>
  );
};
