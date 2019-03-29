import { createMuiTheme } from '@material-ui/core';

const SMTheme = createMuiTheme({
  // Color palette
  palette: {
    primary: {
      main: '#1964e6',
    },
    secondary: {
      main: '#000000',
    },
  },
  // Typography
  typography: {
    useNextVariants: true,
    fontSize: 16,
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      'Lato',
    ].join(','),
    body1: {
      fontSize: '1rem',
    },
    subtitle1: {
      fontSize: '1.2rem',
    },
    h1: {
      fontSize: '2.2rem',
    },
    h2: {
      fontSize: '2rem',
    },
    h3: {
      fontSize: '1.8rem',
    },
    h4: {
      fontSize: '1.6rem',
    },
    h5: {
      fontSize: '1.4rem',
    },
    h6: {
      fontSize: '1.2rem',
    },
  },
  spacing: {
    unit: 8,
  },
});

export default { SMTheme };
