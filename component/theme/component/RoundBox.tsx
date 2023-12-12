import React from 'react';

import { Box, useTheme } from '@mui/material';

export const RoundBox = ({
  children,
  padding = 4,
}: {
  children: React.ReactNode;
  padding?: number;
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderRadius: 2,
        bgcolor: theme.palette.background.neutral,
        overflow: 'clip',
      }}
      padding={padding}
    >
      {children}
    </Box>
  );
};
