const styles = theme => ({
  hideSidebarButton: {
    width: 50,
    height: 40,
    marginLeft: -10,
    marginTop: -10,
    backgroundColor: '#fff',
    transition: '0.2s',
    whiteSpace: 'nowrap',
    '& p': {
      display: 'none',
      width: 0,
      transition: 'width 0.2s',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    '&:hover:focus': {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      width: 200,
      '& p': {
        display: 'block',
        width: '100%',
      },
    },
  },
  fullLength: {
    width: 200,
    color: '#000',
    '& p': {
      display: 'block',
      width: '100%',
    },
  },
  reversed: {
    flexDirection: 'row-reverse',
  },
  buttonContent: {
    position: 'absolute',
    left: 12,
    display: 'flex',
    alignItems: 'center',
  },
  keyboardFocus: {
    boxShadow: 'none !important',
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    width: 200,
    '& p': {
      display: 'block',
      width: '100%',
    },
  },
});


export default styles;
