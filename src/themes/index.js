import { createMuiTheme } from "@material-ui/core";

const SMTheme = createMuiTheme({
  // Color palette
  palette: {
    primary: {
      main: '#1964e6'
    }
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
      fontWeight: 700,
    },
  },
  spacing: {
    unit: 8
  }
});

export default { SMTheme }