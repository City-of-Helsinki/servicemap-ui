import { createTheme } from '@mui/material/styles';

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

// Color palette from Helsinki Design System
const colors = {
  lightGray: 'rgba(222, 222, 222, 1)',
  black03: '#F4F4F4',
};

// Color palette for normal theme
export const paletteDefault = {
  primary: {
    main: 'rgb(10, 26, 175)',
    highContrast: '#fff',
  },
  secondary: {
    main: 'rgb(43, 47, 57)',
    hover: '#1d39ad',
  },
  white: {
    light: '#f2f2f2',
    main: '#FFFFFF',
    dark: '#949494',
    contrastText: '#000',
  },
  detail: {
    main: 'rgb(10, 26, 175)',
    alpha: 'rgb(10, 26, 175, 0.5)',
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
    background: 'rgb(10, 26, 175)',
    border: '#fff',
  },
  link: {
    main: '#3333FF',
  },
  border: {
    main: colors.lightGray,
  },
  hover: {
    main: colors.black03,
  },
};

// Color palette for dark theme
export const paletteDark = {
  primary: {
    main: 'rgb(53, 54, 56)',
    highContrast: '#fff',
  },
  secondary: {
    main: 'rgb(43, 47, 57)',
    hover: '#5b5d61',
  },
  background: {
    main: '#4A4A4C',
    plain: '#4A4A4C',
    front:
      'linear-gradient(326.21deg, rgba(0, 0, 0, 0.79) 0%, rgba(71, 71, 71, 0.79) 100%)',
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
    border: '#fff',
  },
  link: {
    main: '#3333FF',
  },
  border: {
    main: colors.lightGray,
  },
  hover: {
    main: colors.black03,
  },
};

const focusIndicator = {
  outline: '2px solid transparent !important',
  borderRadius: '4px',
  boxShadow:
    `0 0 0 2px rgb(255, 255, 255), 0 0 0 6px ${paletteDefault.primary.main}, ` +
    '0 0 0 8px rgb(255, 255, 255) !important',
  zIndex: '1',
};

const focusIndicatorDark = {
  outline: '2px solid transparent !important',
  boxShadow:
    '0 0 0 2px rgb(255, 255, 255), 0 0 0 6px rgb(0, 0, 0), 0 0 0 8px rgb(255, 255, 255) !important',
  zIndex: '1',
};

const components = (theme) => ({
  MuiListItem: {
    styleOverrides: {
      button: {
        '&:hover': {
          backgroundColor: '#DEDEDE',
        },
      },
    },
  },
  MuiButtonBase: {
    defaultProps: {
      disableRipple: true,
    },
    styleOverrides: {
      root: {
        // Default keyboard focus indicator for buttons
        '&.Mui-focusVisible':
          theme === 'dark' ? focusIndicatorDark : focusIndicator,
      },
    },
  },
  MuiButton: {
    defaultProps: {
      disableFocusRipple: true,
      disableRipple: true,
    },
    styleOverrides: {
      root: {
        transition: 'none',
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      // Default keyboard focus indicator for input fields
      root: {
        '&.Mui-focused': theme === 'dark' ? focusIndicatorDark : focusIndicator,
      },
    },
  },
  MuiRadio: {
    styleOverrides: {
      root: {
        '&.Mui-focusVisible':
          theme === 'dark' ? focusIndicatorDark : focusIndicator,
        marginRight: 8,
      },
    },
  },
  MuiCheckbox: {
    styleOverrides: {
      root: {
        '&.Mui-focusVisible':
          theme === 'dark' ? focusIndicatorDark : focusIndicator,
        marginRight: 8,
      },
    },
  },
  MuiListItemText: {
    styleOverrides: {
      root: {
        marginTop: 0,
        marginBottom: 0,
      },
    },
  },
  MuiSvgIcon: {
    styleOverrides: {
      root: {
        fontSize: 24,
      },
    },
  },
  MuiTypography: {
    defaultProps: {
      variant: 'body2',
    },
  },
  PrivateSwitchBase: {
    styleOverrides: {
      root: {
        padding: 12,
        marginRight: 8,
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
  appBar: 1200,
};

const typography = {
  useNextVariants: true,
  fontSize: 16,
  // Use the system font instead of the default Roboto font.
  fontFamily: ['Lato'].join(','),
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

// Themes
const SMTheme = createTheme({
  props,
  components: components('default'),
  breakpoints,
  typography,
  spacing,
  custom,
  palette: paletteDefault,
  zIndex,
  focusIndicator,
});

const SMThemeDark = createTheme({
  props,
  components: components('dark'),
  breakpoints,
  typography,
  spacing,
  custom,
  palette: paletteDark,
  zIndex,
  focusIndicator: focusIndicatorDark,
});

const themes = { SMTheme, SMThemeDark };
export default themes;
