
export default theme => ({
  container: {
    padding: theme.spacing(1),
  },
  linkText: {
    color: theme.palette.primary.main,
    wordBreak: 'break-word',
  },
  linkIcon: {
    color: theme.palette.primary.main,
    marginLeft: theme.spacing(1),
  },
  radioGroup: {
    flexWrap: 'nowrap',
    flexDirection: 'row',
    margin: `${theme.spacing(2)} 0`,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  radioGroupItem: {
    [theme.breakpoints.down('sm')]: {
      margin: `${theme.spacing(1)} 0`,
    },
  },
  urlContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(222, 223, 225, 0.25)',
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    margin: `0 0 ${theme.spacing(3)} 0`,
    border: '1px solid #DEDFE1',
    width: '100%',
    textAlign: 'left',
    '&:hover': {
      backgroundColor: 'rgba(222, 223, 225, 0.50)',
    },
  },
  shareButton: {
    ...theme.typography.body2,
    boxSizing: 'border-box',
    borderRadius: 2,
    color: theme.palette.primary.highContrast,
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
    '&:disabled': {
      backgroundColor: theme.palette.disabled.strong,
    },
    minHeight: 38,
    padding: '0 11px',
  },
  shareIcon: {
    fontSize: 16,
    marginLeft: theme.spacing(1),
  },
});
