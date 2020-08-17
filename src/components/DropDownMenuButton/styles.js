
export default theme => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
  },
  button: {
    height: '100%',
    marginRight: theme.spacing.unit,
    '& p': {
      marginRight: theme.spacing.unitDouble,
      textTransform: 'none',
    },
  },
  icon: {
    boxShadow: `0 4px 8px 0 ${theme.palette.detail.alpha}`,
    color: theme.palette.primary.contrastText,
    display: 'flex',
    flexShrink: 0,
    backgroundColor: theme.palette.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
    borderRadius: '50%',
    margin: theme.spacing.unit,
    marginRight: theme.spacing.unitDouble,
    '& svg': {
      fontSize: '1rem',
    },
  },
  iconRight: {
    marginLeft: theme.spacing.unitDouble,
    fontSize: 24,
  },
  menuItem: {
    ...theme.typography.body2,
    '& span': {
      width: 32,
      margin: theme.spacing.unit,
      marginRight: theme.spacing.unitDouble,
    },
    '& p': {
      marginRight: theme.spacing.unitDouble,
      textTransform: 'none',
      fontWeight: 'normal',
    },
  },
});
