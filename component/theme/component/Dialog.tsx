import React from 'react';

import { Dialog as MuiDlg, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import type { DialogProps } from '@mui/material';

interface Props extends DialogProps {
  borderRadius?: string;
}

export const Dialog = ({
  borderRadius,
  fullScreen,
  children,
  ...rest
}: Props): JSX.Element => {
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <MuiDlg
      fullScreen={fullScreen && downMd}
      {...rest}
      sx={{
        borderRadius: borderRadius || '8px',
        backdropFilter: 'blur(4px)',
      }}
      PaperProps={{
        sx: {
          background: fullScreen && downMd ? 'black' : theme.palette.grey[900],
        },
      }}
    >
      {children}
    </MuiDlg>
  );
};
