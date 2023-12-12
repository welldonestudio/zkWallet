import type { ReactNode } from 'react';
import { useMemo } from 'react';

import { CssBaseline } from '@mui/material';
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from '@mui/material/styles';
import Head from 'next/head';

import breakpoints from './provider/breakpoints';
import palette from './provider/palette';
import shadows, { customShadows } from './provider/shadows';
import typography from './provider/typography';

import type { ThemeOptions } from '@mui/material/styles';

type Props = {
  children: ReactNode;
};

export default function ThemeProvider({ children }: Props) {
  const themeOptions: ThemeOptions = useMemo(
    () => ({
      palette: palette.dark,
      typography,
      breakpoints,
      shape: {
        borderRadius: 8,
      },
      welldone: {
        borderRadius: { default: 8, small: 6 },
        height: { default: '44px', small: '36px' },
      },
      // direction: themeDirection,
      shadows: shadows.dark,
      customShadows: customShadows.dark,
    }),
    // [themeDirection]
    [],
  );

  const theme = createTheme(themeOptions);
  // theme.components = componentsOverride(theme);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>WELLDONE zkWallet</title>
        <meta name="description" content="WELLDONE zkWallet" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/no-css-tags*/}
        <link href="/fonts/index.css" rel="stylesheet" />
      </Head>
      {children}
    </MUIThemeProvider>
  );
}
