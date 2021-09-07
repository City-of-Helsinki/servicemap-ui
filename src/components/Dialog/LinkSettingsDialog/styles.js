
export default theme => ({
  linkText: {
    color: theme.palette.primary.main,
  },
  linkIcon: {
    color: theme.palette.primary.main,
  },
  radioGroup: {
    flexWrap: 'nowrap',
    flexDirection: 'row',
    margin: `${theme.spacing(2)}px 0`,
  },
  urlContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(222, 223, 225, 0.25)',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    margin: `${theme.spacing(1)}px 0`,
    border: '1px solid #DEDFE1',
    width: '100%',
    textAlign: 'left',
    '&:hover': {
      backgroundColor: 'rgba(222, 223, 225, 0.50)',
    },
  },
  shareButton: {
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
