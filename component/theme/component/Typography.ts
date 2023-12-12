import { Typography as MuiTypography, styled } from '@mui/material';

import type { TypographyProps as MuiTypographyProps } from '@mui/material';

export type FontFamily =
  | 'SUIT Variable'
  | 'itc-avant-garde-gothic-pro'
  | 'RobotoMono Light'
  | 'RobotoMono Regular';

export interface TypographyProps extends MuiTypographyProps {
  tnum?: boolean;
  ss18?: boolean;
  ss19?: boolean;
  fontFamily?: FontFamily;
}

export const Typography = styled(MuiTypography, {
  shouldForwardProp: (prop) =>
    prop !== 'tnum' &&
    prop !== 'ss18' &&
    prop !== 'ss19' &&
    prop !== 'fontFamily',
})<TypographyProps>(({ tnum, ss18, ss19, fontFamily }: TypographyProps) => {
  const fontFeatureSettings = [];

  if (tnum || typeof tnum !== 'undefined') fontFeatureSettings.push("'tnum'");
  if (ss18) fontFeatureSettings.push("'ss18'");
  if (ss19) fontFeatureSettings.push("'ss19'");

  return {
    fontFeatureSettings: fontFeatureSettings.toString(),
    fontFamily: fontFamily || 'SUIT Variable',
  };
});
