import { createMuiTheme } from '@material-ui/core';

const focusIndicator = {
  outline: '2px solid transparent',
  boxShadow: '0 0 0 2px rgb(255, 255, 255), 0 0 0 6px rgb(71, 131, 235), 0 0 0 8px rgb(255, 255, 255)',
};

const focusIndicatorDark = {
  outline: '2px solid transparent',
  boxShadow: '0 0 0 2px rgb(255, 255, 255), 0 0 0 6px rgb(0, 0, 0), 0 0 0 8px rgb(255, 255, 255)',
};

const props = {
  // Globally disable all default mui focus effects
  MuiButtonBase: {
    disableRipple: true,
  },
  MuiButton: {
    disableRipple: true,
    disableFocusRipple: true,
  },
  MuiTypography: {
    variant: 'body2',
  },
};

const overrides = theme => ({
  MuiButtonBase: {
    root: {
      // Default keyboard focus indicator for buttons
      '&$focusVisible': theme === 'dark' ? focusIndicatorDark : focusIndicator,
    },
  },
  MuiInputBase: {
    // Default keyboard focus indicator for input fields
    root: { '&$focused': theme === 'dark' ? focusIndicatorDark : focusIndicator },
  },
  MuiListItemText: {
    root: {
      marginTop: 0,
      marginBottom: 0,
    },
  },
  MuiSvgIcon: {
    root: {
      fontSize: 24,
    },
  },
  PrivateSwitchBase: {
    root: {
      padding: 12,
    },
  },
  MuiAccordionSummary: {
    root: {
      '&$expanded': {
        minHeight: 0,
      },
    },
  },
});

const breakpoints = {
  values: {
    xs: 0,
    sm: 700,
    md: 900,
    lg: 1280,
    xl: 1920,
  },
};

const spacing = 8;

const custom = {
  body2light: {
    color: 'rgba(0,0,0,0.7)',
  },
};

const zIndex = {
  behind: -1,
  forward: 50,
  sticky: 51,
  infront: 900,
};

const typography = {
  useNextVariants: true,
  fontSize: 16,
  // Use the system font instead of the default Roboto font.
  fontFamily: [
    'Lato',
  ].join(','),
  body1: {
    fontSize: '1.043rem',
    letterSpacing: '0.03125rem', // 0.5px
    lineHeight: '1.75rem',
  },
  body2: {
    fontSize: '0.913rem',
    letterSpacing: '0.015625rem', // 0.25px
    lineHeight: '1.25rem',
  },
  subtitle1: {
    fontSize: '1.03rem',
    fontWeight: 'bold',
    letterSpacing: '0.00937rem', // 0.15px
    lineHeight: '1.5rem',
  },
  caption: {
    fontSize: '0.7725rem', // 12.36px
    fontWeight: 'bold',
    letterSpacing: '0.025rem', // 0.4px
    lineHeight: '1rem',
    color: 'rgba(0,0,0,0.6)',
  },
  h1: {
    fontSize: '6.259rem',
    letterSpacing: '-0.09375em', // -1.5px
  },
  h2: {
    fontSize: '3.862rem',
    fontWeight: 'bold',
    letterSpacing: '-0.03125rem', // -0.5px
  },
  h3: {
    fontSize: '3.089rem',
    fontWeight: 'bold',
    letterSpacing: 0,
  },
  h4: {
    fontSize: '2.214rem',
    letterSpacing: '0.015625rem', // 0.25px
  },
  h5: {
    fontSize: '1.564rem',
    letterSpacing: 0,
  },
  h6: {
    fontSize: '1.288rem',
    fontWeight: 'bold',
    letterSpacing: '0.015625rem', // 0.25px
    lineHeight: '1.5rem',
  },
  button: {
    fontSize: '0.90125rem', // 14.42px
    fontWeight: 'bold',
    letterSpacing: '0.078125rem', // 1.25px
    lineHeight: '1rem', // 16px
    color: '#ffffff',
  },
  overline: {
    fontSize: '0.7725rem', // 12.36px
    fontWeight: 'bold',
    letterSpacing: '0.125rem', // 2px
    lineHeight: '1rem',
  },
};

// Color palette for normal theme
export const paletteDefault = {
  primary: {
    main: 'rgb(25, 100, 230)',
    highContrast: '#fff',
  },
  secondary: {
    main: 'rgb(43, 47, 57)',
    hover: '#1d39ad',
  },
  background: {
    main: 'linear-gradient(340.58deg, rgb(11, 123, 237) 0%, rgb(20, 108, 232) 67.04%, rgb(25, 100, 230) 100%)',
    plain: 'rgb(20, 108, 232)',
    front: 'linear-gradient(340.58deg, rgb(11, 123, 237) 0%, rgb(20, 108, 232) 67.04%, rgb(25, 100, 230) 100%)',
  },
  white: {
    light: '#f2f2f2',
    main: '#FFFFFF',
    dark: '#949494',
    contrastText: '#000',
  },
  detail: {
    main: 'rgb(25, 100, 230)',
    alpha: 'rgba(25,100,230,0.5)',
  },
  disabled: {
    main: 'rgb(239, 239, 239)',
    strong: '#898989',
  },
  focusBorder: {
    main: 'rgb(71, 131, 235)',
  },
  warning: {
    main: '#AF0021',
  },
  measuringStroke: {
    main: '#fff',
    background: 'rgb(25, 100, 230)',
  },
};

// Color palette for dark theme
export const paletteDark = {
  primary: {
    main: '#353638',
    highContrast: '#fff',
  },
  secondary: {
    main: 'rgb(43, 47, 57)',
    hover: '#5b5d61',
  },
  background: {
    main: '#4A4A4C',
    plain: '#4A4A4C',
    front: 'linear-gradient(326.21deg, rgba(0, 0, 0, 0.79) 0%, rgba(71, 71, 71, 0.79) 100%)',
  },
  white: {
    light: '#f2f2f2',
    main: '#FFFFFF',
    dark: '#949494',
    contrastText: '#000',
  },
  detail: {
    main: '#585B63',
    alpha: 'rgba(88,91,99,0.5)',
  },
  disabled: {
    main: 'rgb(239, 239, 239)',
    strong: '#898989',
  },
  warning: {
    main: '#AF0021',
  },
  focusBorder: {
    main: '#000',
  },
  measuringStroke: {
    main: '#313131',
    background: '#A6A6A6',
  },
};

// Themes
const SMTheme = createMuiTheme({
  props,
  overrides: overrides('default'),
  breakpoints,
  typography,
  spacing,
  custom,
  palette: paletteDefault,
  zIndex,
});

const SMThemeDark = createMuiTheme({
  props,
  overrides: overrides('dark'),
  breakpoints,
  typography,
  spacing,
  custom,
  palette: paletteDark,
  zIndex,
});


export default { SMTheme, SMThemeDark };
