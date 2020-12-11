const styles = theme => ({
  hideSidebarButton: {
    maxWidth: 50,
    minWidth: 50,
    height: 40,
    marginLeft: -10,
    marginTop: -10,
    padding: 10,
    backgroundColor: '#fff',
    transition: '0.2s',
    '& p': {
      display: 'none',
      maxWidth: 0,
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      maxWidth: 200,
      '& p': {
        display: 'block',
        maxWidth: 200,
      },
    },
  },
  fullLength: {
    minWidth: 200,
    maxWidth: 200,
    color: '#000',
    '& p': {
      display: 'block',
      maxWidth: 200,
    },
  },
  reversed: {
    flexDirection: 'row-reverse',
  },
  buttonContent: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  keyboardFocus: {
    boxShadow: 'none !important',
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    maxWidth: 200,
    '& p': {
      display: 'block',
      maxWidth: 200,
    },
  },
});


export default styles;
