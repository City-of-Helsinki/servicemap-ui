
export default theme => ({
  root: {
    alignItems: 'center',
    display: 'block',
    height: '100%',
    width: 230,
    marginRight: theme.spacing(2),
    flex: '0 1 auto',
  },
  button: {
    height: '100%',
    width: '100%',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(2),
    '& p': {
      marginRight: theme.spacing(2),
      textTransform: 'none',
    },
    color: 'black',
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
    margin: theme.spacing(1),
    marginRight: theme.spacing(2),
    '& svg': {
      fontSize: '1rem',
    },
  },
  iconRight: {
    marginLeft: 'auto',
    fontSize: '1.5rem',
  },
  menuItem: {
    padding: theme.spacing(1),
    paddingRight: theme.spacing(2),
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
      marginRight: theme.spacing(2),
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
    padding: theme.spacing(1),
    boxSizing: 'border-box',
    backgroundColor: 'white',
    color: 'black',
    zIndex: 2,
    border: `${theme.palette.detail.alpha} solid 0.5px`,
    borderRadius: 4,
  },
});
