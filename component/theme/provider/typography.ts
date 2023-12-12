import { pxToRem, responsiveFontSizes } from '../utils/getFontValue';

// ----------------------------------------------------------------------

const FONT_VARIABLE = [
  'SUIT Variable',
  'itc-avant-garde-gothic-pro',
  'RobotoMono Light',
  'RobotoMono Regular',
];

const typography = {
  fontFamily: FONT_VARIABLE.join(','),
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  fontWeightBold: 700,
  h1: {
    fontWeight: 900,
    lineHeight: 80 / 64,
    fontSize: pxToRem(40),
    letterSpacing: '200%',
    ...responsiveFontSizes({
      sm: {
        fontSize: 52,
        lineHeight: 1.3, // 130%
        letterSpacing: -0.008, // -0.8%
      },
      md: {
        fontSize: 64,
        lineHeight: 1.3,
        letterSpacing: -0.008,
      },
    }),
  },
  h2: {
    fontWeight: 800,
    lineHeight: 64 / 48,
    fontSize: pxToRem(32),
    ...responsiveFontSizes({
      sm: {
        fontSize: 40,
        lineHeight: 1.4,
        letterSpacing: -0.004,
      },
      md: {
        fontSize: 48,
        lineHeight: 1.4,
        letterSpacing: -0.004,
      },
    }),
  },
  h3: {
    fontWeight: 800,
    lineHeight: 1.5,
    fontSize: pxToRem(24),
    ...responsiveFontSizes({
      sm: {
        fontSize: 26,
        lineHeight: 1.5,
        letterSpacing: -0.004,
      },
      md: {
        fontSize: 32,
        lineHeight: 1.5,
        letterSpacing: -0.004,
      },
    }),
  },
  h4: {
    fontWeight: 800,
    lineHeight: 1.5,
    fontSize: pxToRem(20),
    ...responsiveFontSizes({
      sm: {
        fontSize: 20,
        lineHeight: 1.5,
        letterSpacing: -0.004,
      },
      md: {
        fontSize: 24,
        lineHeight: 1.5,
        letterSpacing: -0.004,
      },
    }),
  },
  h5: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(18),
    ...responsiveFontSizes({
      sm: {
        fontSize: 19,
        lineHeight: 1.55,
        letterSpacing: -0.004,
      },
      md: {
        fontSize: 20,
        lineHeight: 1.55,
        letterSpacing: -0.004,
      },
    }),
  },
  h6: {
    fontWeight: 700,
    lineHeight: 28 / 18,
    fontSize: pxToRem(17),
    ...responsiveFontSizes({
      sm: {
        fontSize: 18,
        lineHeight: 1.55,
        letterSpacing: 0,
      },
      md: {
        fontSize: 18,
        lineHeight: 1.55,
        letterSpacing: 0,
      },
    }),
  },
  subtitle1: {
    fontWeight: 600,
    lineHeight: 1.5,
    ...responsiveFontSizes({
      sm: {
        fontSize: 16,
        lineHeight: 1.55,
        letterSpacing: -0.004,
      },
      md: {
        fontSize: 16,
        lineHeight: 1.55,
        letterSpacing: -0.004,
      },
    }),
  },
  subtitle2: {
    fontWeight: 600,
    lineHeight: 22 / 14,
    ...responsiveFontSizes({
      sm: {
        fontSize: 14,
        lineHeight: 1.55,
        letterSpacing: 0,
      },
      md: {
        fontSize: 14,
        lineHeight: 1.55,
        letterSpacing: 0,
      },
    }),
  },
  body1: {
    fontWeight: 500,
    lineHeight: 1.5,
    ...responsiveFontSizes({
      sm: {
        fontSize: 16,
        lineHeight: 1.55,
        letterSpacing: 0,
      },
      md: {
        fontSize: 16,
        lineHeight: 1.55,
        letterSpacing: 0,
      },
    }),
  },
  body2: {
    fontWeight: 300,
    lineHeight: 22 / 14,
    ...responsiveFontSizes({
      sm: {
        fontSize: 14,
        lineHeight: 1.55,
        letterSpacing: 0,
      },
      md: {
        fontSize: 14,
        lineHeight: 1.55,
        letterSpacing: 0,
      },
    }),
  },
  caption: {
    fontWeight: 500,
    lineHeight: 1.5,
    ...responsiveFontSizes({
      sm: {
        fontSize: 12,
        lineHeight: 1.6,
        letterSpacing: 0,
      },
      md: {
        fontSize: 12,
        lineHeight: 1.6,
        letterSpacing: 0,
      },
    }),
  },
  overline: {
    fontWeight: 800,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    ...responsiveFontSizes({
      sm: {
        fontSize: 12,
        lineHeight: 1.5,
        letterSpacing: 0.002,
      },
      md: {
        fontSize: 12,
        lineHeight: 1.5,
        letterSpacing: 0.002,
      },
    }),
  },
  button: {
    fontWeight: 700,
    lineHeight: 24 / 14,
    fontSize: pxToRem(14),
    ...responsiveFontSizes({
      sm: {
        fontSize: 14,
        lineHeight: 1.7,
        letterSpacing: 0.015,
      },
      md: {
        fontSize: 14,
        lineHeight: 1.7,
        letterSpacing: 0.015,
      },
    }),
  },
} as const;

export default typography;
