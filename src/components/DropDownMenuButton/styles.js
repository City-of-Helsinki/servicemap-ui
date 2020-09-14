
export default theme => ({
  root: {
    alignItems: 'center',
    display: 'block',
    height: '100%',
    width: 230,
    marginRight: theme.spacing.unitDouble,
  },
  button: {
    height: '100%',
    width: '100%',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unitDouble,
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
    marginLeft: 'auto',
    fontSize: 24,
  },
  menuItem: {
    justifyContent: 'start',
    flex: '1 0 auto',
    alignItems: 'center',
    cursor: 'pointer',
    ...theme.typography.body2,
    // Icon element
    '& span': {
      display: 'flex',
      justifyContent: 'center',
      flexShrink: 0,
      width: 32,
      margin: theme.spacing.unit,
      marginRight: theme.spacing.unitDouble,
    },
    // Text element
    '& p': {
      textAlign: 'left',
      textTransform: 'none',
      fontWeight: 'normal',
    },
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
  },
  menuPanel: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    width: 'inherit',
    padding: theme.spacing.unit,
    boxSizing: 'border-box',
    backgroundColor: 'white',
    color: 'black',
    zIndex: 2,
    border: `${theme.palette.detail.alpha} solid 0.5px`,
    borderRadius: 4,
  },
});
