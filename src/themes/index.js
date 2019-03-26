import { createMuiTheme } from '@material-ui/core';

const SMTheme = createMuiTheme({
  // Color palette
  palette: {
    primary: {
      main: '#1964e6',
    },
    secondary: {
      main: '#ffffff',
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
      fontSize: 16,
    },
    subtitle1: {
      fontSize: 12,
    },
    h1: {
      fontSize: 22,
    },
    h2: {
      fontSize: 20,
    },
    h3: {
      fontSize: 18,
    },
    h4: {
      fontSize: 16,
    },
    h5: {
      fontSize: 14,
    },
    h6: {
      fontSize: 12,
    },
  },
  spacing: {
    unit: 8,
  },
});

export default { SMTheme };
