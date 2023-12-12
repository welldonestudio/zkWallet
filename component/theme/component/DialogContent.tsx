import React from 'react';

import { DialogContent as MuiDlgContent, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import type { DialogContentProps } from '@mui/material';

interface Props extends DialogContentProps {
  fullScreen?: boolean;
  disablePaddingTop?: boolean;
  style?: any;
}

export const DialogContent = ({
  fullScreen,
  disablePaddingTop,
  style,
  children,
  ...rest
}: Props): JSX.Element => {
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <MuiDlgContent
      {...rest}
      style={{
        ...style,
        maxHeight: fullScreen || !downMd ? '' : '420px',
        paddingTop:
          (fullScreen && downMd) || disablePaddingTop ? '0px' : '24px',
      }}
    >
      {children}
    </MuiDlgContent>
  );
};
