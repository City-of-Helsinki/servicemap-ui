
export default theme => ({
  root: {
    alignItems: 'center',
    display: 'block',
    height: '100%',
    width: 180,
    flex: '0 1 auto',
  },
  button: {
    height: '100%',
    width: '100%',
    '& p': {
      textTransform: 'none',
    },
    color: 'black',
    justifyContent: 'flex-start',
  },
  icon: {
    color: theme.palette.primary.main,
    paddingRight: theme.spacing(1),
  },
  iconRight: {
    marginLeft: 'auto',
    fontSize: '1.5rem',
  },
  menuItem: {
    height: 56,
    padding: theme.spacing(1),
    paddingRight: theme.spacing(2),
    justifyContent: 'start',
    flex: '1 0 auto',
    alignItems: 'center',
    cursor: 'pointer',
    ...theme.typography.body2,
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
    width: 450,
    padding: theme.spacing(2),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
    boxSizing: 'border-box',
    backgroundColor: 'white',
    color: 'black',
    zIndex: 2,
    border: `${theme.palette.detail.alpha} solid 0.5px`,
    borderRadius: 4,
    right: 0,
  },
});
