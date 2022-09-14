export default theme => ({
  button: {
    minHeight: 38,
    padding: '0 11px',
    boxSizing: 'border-box',
    borderRadius: 4,
  },
  smallButton: {
    minHeight: 32,
    padding: '0 8px',
  },
  margin: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  marginRight: {
    marginRight: theme.spacing(2),
  },
  primary: {
    color: theme.palette.primary.highContrast,
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
    '&:disabled': {
      backgroundColor: theme.palette.disabled.strong,
    },
  },
  secondary: {
    color: theme.palette.secondary.contrastText,
    backgroundColor: '#353638',
    border: `0.5px solid ${theme.palette.secondary.contrastText}`,
    '&:hover': {
      backgroundColor: theme.palette.secondary.light,
    },
    '&:disabled': {
      backgroundColor: theme.palette.secondary.light,
      color: 'rgba(0, 0, 0, 0.5)',
    },
  },
  default: {
    color: theme.palette.white.contrastText,
    backgroundColor: theme.palette.white.main,
    border: `0.5px solid ${theme.palette.white.contrastText}`,
    '&:hover': {
      backgroundColor: theme.palette.white.light,
    },
    '&:disabled': {
      // backgroundColor: theme.palette.white.dark,
      borderColor: theme.palette.white.dark,
      color: 'rgba(0, 0, 0, 0.5)',
    },
  },
  typography: {
    fontSize: '0.875rem',
  },
});
