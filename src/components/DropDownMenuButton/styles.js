
export default theme => ({
  root: {
    alignItems: 'center',
    display: 'block',
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
    // display: 'flex',
    flex: '1 0 auto',
    alignItems: 'center',
    cursor: 'pointer',
    ...theme.typography.body2,
    // Icon element
    '& span': {
      width: 32,
      margin: theme.spacing.unit,
      marginRight: theme.spacing.unitDouble,
    },
    // Text element
    '& p': {
      marginRight: theme.spacing.unitDouble,
      textTransform: 'none',
      fontWeight: 'normal',
    },
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
  },
  menuPanel: {
    display: 'flex',
    position: 'absolute',
    width: '185px',
    marginLeft: '5px',
    borderWidth: 'thin',
    borderColor: 'black',
    borderStyle: 'none',
    backgroundColor: 'white',
    color: 'black',
    zIndex: 2,
  },
});
