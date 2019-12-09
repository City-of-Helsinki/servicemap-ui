export default theme => ({
  button: {
    minHeight: 36,
    marginRight: theme.spacing.unitDouble,
    boxSizing: 'border-box',
    borderRadius: 2,
    '&:disabled': {
      backgroundColor: 'rgba(0, 0, 0, 0.12)',
      border: 'none',
      color: 'rgba(0, 0, 0, 0.26)',
    },
  },
  primary: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    border: `0.5px solid ${theme.palette.primary.contrastText}`,
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
  },
  secondary: {
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.main,
    border: `0.5px solid ${theme.palette.secondary.contrastText}`,
    '&:hover': {
      backgroundColor: theme.palette.secondary.light,
    },
  },
  default: {
    color: theme.palette.white.contrastText,
    backgroundColor: theme.palette.white.main,
    border: `0.5px solid ${theme.palette.white.contrastText}`,
    '&:hover': {
      backgroundColor: theme.palette.white.dark,
    },
  },
  typography: {
    textTransform: 'none',
    margin: theme.spacing.unit,
  },
});
