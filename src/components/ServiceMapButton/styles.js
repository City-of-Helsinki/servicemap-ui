export default theme => ({
  bigText: {
    fontSize: 14,
  },
  button: {
    minHeight: 36,
    padding: '0 11px',
    boxSizing: 'border-box',
    borderRadius: 2,
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
    border: `0.5px solid ${theme.palette.primary.contrastText}`,
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
    '&:disabled': {
      backgroundColor: theme.palette.primary.light,
      color: 'rgba(0, 0, 0, 0.5)',
    },
  },
  secondary: {
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.main,
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
  },
});
