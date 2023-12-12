import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

function createGradient(color1: string, color2: string) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`;
}

export type ColorSchema =
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

interface GradientsPaletteOptions {
  primary: string;
  secondary: string;
  info: string;
  success: string;
  warning: string;
  error: string;
}

interface ChartPaletteOptions {
  violet: string[];
  blue: string[];
  green: string[];
  yellow: string[];
  red: string[];
}

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    neutral: string;
  }
  interface SimplePaletteColorOptions {
    lighter: string;
    darker: string;
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
  }
  interface Palette {
    gradients: GradientsPaletteOptions;
    chart: ChartPaletteOptions;
  }
  interface PaletteOptions {
    gradients: GradientsPaletteOptions;
    chart: ChartPaletteOptions;
  }
}

declare module '@mui/material' {
  interface Color {
    0: string;
    300_8: string;
    300_12: string;
    300_16: string;
    300_24: string;
    300_32: string;
    300_48: string;
    500_8: string;
    500_12: string;
    500_16: string;
    500_24: string;
    500_32: string;
    500_48: string;
    500_56: string;
    500_80: string;
  }
}

// SETUP COLORS
const PRIMARY = {
  lighter: '#DAE5FF',
  light: '#7AA2FF',
  main: '#3B72F2',
  dark: '#003DAA',
  darker: '#002979',
};
const SECONDARY = {
  lighter: '#E8E1FE',
  light: '#B7A5FD',
  main: '#826AF9',
  dark: '#4635B3',
  darker: '#1E1477',
};
const INFO = {
  lighter: '#D8FEF3',
  light: '#8BFBEE',
  main: '#2EBBD1',
  dark: '#1F90AF',
  darker: '#14688D',
};
const SUCCESS = {
  lighter: '#E0FCD9',
  light: '#8CEF8A',
  main: '#3DCC55',
  dark: '#1E9248',
  darker: '#0B613A',
};
const WARNING = {
  lighter: '#FFF9CB',
  light: '#FFE667',
  main: '#FFCC00',
  dark: '#DAAA00',
  darker: '#936D00',
};
const ERROR = {
  lighter: '#FEE7D7',
  light: '#FFA489',
  main: '#FF483A',
  dark: '#DA2A2D',
  darker: '#931129',
};

const GREY = {
  0: '#FFFFFF',
  100: '#ECEEF4',
  200: '#D0D5E2',
  300: '#8F98AE',
  400: '#6E7891',
  500: '#566077',
  600: '#454B5C',
  700: '#343844',
  800: '#20222A',
  900: '#131417',
  300_8: alpha('#8F98AE', 0.08),
  300_12: alpha('#8F98AE', 0.12),
  300_16: alpha('#8F98AE', 0.16),
  300_24: alpha('#8F98AE', 0.24),
  300_32: alpha('#8F98AE', 0.32),
  300_48: alpha('#8F98AE', 0.48),
  500_8: alpha('#566077', 0.08),
  500_12: alpha('#566077', 0.12),
  500_16: alpha('#566077', 0.16),
  500_24: alpha('#566077', 0.24),
  500_32: alpha('#566077', 0.32),
  500_48: alpha('#566077', 0.48),
  500_56: alpha('#566077', 0.56),
  500_80: alpha('#566077', 0.8),
};

const GRADIENTS = {
  primary: createGradient(PRIMARY.light, PRIMARY.dark),
  secondary: createGradient(SECONDARY.light, SECONDARY.dark),
  info: createGradient(INFO.light, INFO.dark),
  success: createGradient(SUCCESS.light, SUCCESS.dark),
  warning: createGradient(WARNING.light, WARNING.dark),
  error: createGradient(ERROR.light, ERROR.dark),
  background: '#931129',
};

const CHART_COLORS = {
  violet: ['#826AF9', '#9E86FF', '#D0AEFF', '#F7D2FF'],
  blue: ['#2D99FF', '#83CFFF', '#A5F3FF', '#CCFAFF'],
  green: ['#2CD9C5', '#60F1C8', '#A4F7CC', '#C0F2DC'],
  yellow: ['#FFE700', '#FFEF5A', '#FFF7AE', '#FFF3D6'],
  red: ['#FF6C40', '#FF8F6D', '#FFBD98', '#FFF2D4'],
  // important: 기준색은 0번
};

const COMMON = {
  common: { black: '#000', white: '#fff' },
  primary: { ...PRIMARY, contrastText: '#fff' },
  secondary: { ...SECONDARY, contrastText: '#fff' },
  info: { ...INFO, contrastText: '#fff' },
  success: { ...SUCCESS, contrastText: GREY[800] },
  warning: { ...WARNING, contrastText: GREY[800] },
  error: { ...ERROR, contrastText: '#fff' },
  grey: GREY,
  gradients: GRADIENTS,
  chart: CHART_COLORS,
  divider: alpha(GREY[300], 0.36),
};

const palette = {
  light: {
    ...COMMON,
    mode: 'light',
    text: { primary: GREY[800], secondary: GREY[600], disabled: GREY[500] },
    background: { paper: '#fff', default: '#fff', neutral: GREY[100] },
    action: {
      active: GREY[600],
      hover: GREY[500_8],
      hoverOpacity: 0.24,
      selected: GREY[500_16],
      disabled: GREY[500_80],
      disabledBackground: GREY[500_24],
      focus: GREY[500_24],
      disabledOpacity: 0.48,
      focusOpacity: 0.12,
      activatedOpacity: 0.12,
    },
  },
  dark: {
    ...COMMON,
    mode: 'dark',
    text: { primary: '#fff', secondary: GREY[300], disabled: GREY[500] },
    background: { paper: GREY[700], default: GREY[900], neutral: GREY[500_16] },
    action: {
      active: GREY[300],
      hover: GREY[300_12],
      hoverOpacity: 0.24,
      selected: alpha(GREY[300], 0.28),
      disabled: alpha(GREY[300], 0.75),
      disabledBackground: alpha(GREY[300], 0.38),
      focus: alpha(GREY[300], 0.38),
      disabledOpacity: 0.48,
      focusOpacity: 0.12,
      activatedOpacity: 0.12,
    },
  },
} as const;

export default palette;
