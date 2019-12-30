import { createMuiTheme } from '@material-ui/core';

const breakpoints = {
  values: {
    xs: 0,
    sm: 700,
    md: 900,
    lg: 1280,
    xl: 1920,
  },
};

const spacing = {
  unit: 8,
  unitHalf: 4,
  unitDouble: 16,
  unitTriple: 24,
};

const custom = {
  body2light: {
    color: 'rgba(0,0,0,0.7)',
  },
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
const paletteDefault = {
  primary: {
    main: '#1964E6',
  },
  secondary: {
    main: 'rgba(20,24,35,0.9)',
    hover: '#1d39ad',
  },
  background: {
    main: 'linear-gradient(340.58deg, #0B7BED 0%, #146CE8 67.04%, #1964E6 100%)',
    front: 'linear-gradient(340.58deg, #0B7BED 0%, #146CE8 67.04%, #1964E6 100%)',
  },
  warning: '#AF0021',
};

// Color palette for dark theme
const paletteDark = {
  primary: {
    main: '#353638',
  },
  secondary: {
    main: 'rgba(20,24,35,0.9)',
    hover: '#5b5d61',
  },
  background: {
    main: '#4A4A4C',
    front: 'linear-gradient(326.21deg, rgba(0, 0, 0, 0.79) 0%, rgba(71, 71, 71, 0.79) 100%)',
  },
  warning: '#AF0021',
};

// Themes
const SMTheme = createMuiTheme({
  breakpoints,
  typography,
  spacing,
  custom,
  palette: paletteDefault,
});

const SMThemeDark = createMuiTheme({
  breakpoints,
  typography,
  spacing,
  custom,
  palette: paletteDark,
});


export default { SMTheme, SMThemeDark };
