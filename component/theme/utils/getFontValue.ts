import breakpoints from '../provider/breakpoints';

interface FontOption {
  fontSize: number;
  lineHeight?: number;
  letterSpacing?: number;
  wordSpacing?: number;
}

interface FontOoptions {
  xs?: FontOption;
  sm?: FontOption;
  md: FontOption; // default
  lg?: FontOption;
  xl?: FontOption;
}

export function remToPx(value: string) {
  return Math.round(parseFloat(value) * 16);
}

export function pxToRem(value: number) {
  return `${value / 16}rem`;
}

export function responsiveFontSizes(fontOptions: FontOoptions) {
  const option: { [key: string]: any } = {};

  Object.keys(fontOptions).forEach((item) => {
    if ((fontOptions as any)[item]) {
      const fontSize = ((fontOptions as any)[item] as FontOption).fontSize;
      const lineHeight = ((fontOptions as any)[item] as FontOption).lineHeight;
      const letterSpacing = ((fontOptions as any)[item] as FontOption)
        .letterSpacing;
      const wordSpacing = ((fontOptions as any)[item] as FontOption)
        .wordSpacing;

      option[item] = {
        fontSize: pxToRem(fontSize),
      };

      if (lineHeight) {
        option[item].lineHeight = pxToRem(fontSize * lineHeight);
      }

      if (letterSpacing) {
        option[item].letterSpacing = pxToRem(fontSize * letterSpacing);
      }

      if (wordSpacing) {
        option[item].wordSpacing = pxToRem(fontSize * wordSpacing);
      }
    }
  });

  return {
    [`@media (min-width:${breakpoints.values.xs}px)`]: {
      ...(option.xs || option.sm || option.md),
    },
    [`@media (min-width:${breakpoints.values.sm}px)`]: {
      ...(option.sm || option.md),
    },
    [`@media (min-width:${breakpoints.values.md}px)`]: {
      ...option.md,
    },
    [`@media (min-width:${breakpoints.values.lg}px)`]: {
      ...(option.lg || option.md),
    },
    [`@media (min-width:${breakpoints.values.xl}px)`]: {
      ...(option.xl || option.lg || option.md),
    },
  };
}
