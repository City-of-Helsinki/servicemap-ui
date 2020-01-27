export default theme => ({
  button: {
    height: 38,
    padding: '0 11px',
    boxSizing: 'border-box',
    borderRadius: 2,
  },
  smallButton: {
    height: 34,
    padding: '0 4px',
  },
  margin: {
    marginTop: theme.spacing.unitDouble,
    marginBottom: theme.spacing.unitDouble,
  },
  marginRight: {
    marginRight: theme.spacing.unitDouble,
  },
  primary: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
    '&:disabled': {
      backgroundColor: '#cccccc',
      color: 'rgba(0, 0, 0, 0.5)',
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
    textTransform: 'none',
    margin: theme.spacing.unit,
    fontSize: 14,
  },
  disabled: {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    color: 'rgba(0, 0, 0, 0.26)',
  },
});
