import React from 'react';

import { DialogActions as MuiDlgActions } from '@mui/material';

import type { DialogActionsProps } from '@mui/material';

interface Props extends DialogActionsProps {
  fullScreen?: boolean;
}

export const DialogActions = ({
  fullScreen,
  children,
  ...rest
}: Props): JSX.Element => {
  return (
    <MuiDlgActions
      {...rest}
      style={{
        padding: '16px',
      }}
    >
      {children}
    </MuiDlgActions>
  );
};
