import type { ReactNode } from 'react';
import React, { createRef, useEffect, useState } from 'react';

import {
  Box,
  DialogTitle as MuiDialogTitle,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { Typography } from './Typography';

import type { DialogTitleProps as MuiDialogTitleProps } from '@mui/material';

interface DialogTitleProps extends MuiDialogTitleProps {
  fullScreen?: boolean;
  textAlign?: 'left' | 'center';
  btnRight?: ReactNode;
  btnLeft?: ReactNode;
}

const titleBoxStyle = {
  padding: '12px 24px',
  width: '100%',
  direction: 'row',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export function DialogTitle({
  fullScreen,
  textAlign,
  btnRight,
  btnLeft,
  title,
  children,
  ...rest
}: DialogTitleProps) {
  const theme = useTheme();
  const ref = createRef();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));

  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref && ref.current) {
      setHeight((ref.current as any).offsetHeight);
    }
  }, [ref]);

  return (
    <MuiDialogTitle
      {...rest}
      style={{
        backgroundColor:
          fullScreen && downMd ? 'black' : theme.palette.grey[800],
      }}
    >
      <Box ref={ref}>
        <Box
          sx={{
            position: 'absolute',
            paddingX: '12px',
            height,
            width: fullScreen && downMd ? '100%' : 'calc(100% - 30px)',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>{btnLeft || <>&nbsp;</>}</Box>
          <Box>{btnRight || <>&nbsp;</>}</Box>
        </Box>
        <Box sx={titleBoxStyle}>
          {title ? (
            <Typography
              variant={fullScreen && downMd ? 'subtitle2' : 'h6'}
              sx={{
                color: theme.palette.grey[100],
                verticalAlign: 'middle',
                textAlign: textAlign || 'center',
              }}
            >
              {title}
            </Typography>
          ) : (
            children
          )}
        </Box>
      </Box>
    </MuiDialogTitle>
  );
}
