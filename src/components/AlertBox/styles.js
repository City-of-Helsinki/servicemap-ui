export default theme => ({
  container: {
    padding: theme.spacing(3),
    color: '#fff',
    display: 'flex',
    backgroundColor: theme.palette.primary.main,
    borderBottom: '1px solid',
    borderColor: theme.palette.primary.contrastColor,
  },
  icon: {
    width: 32,
    height: 32,
  },
  cancelIcon: {
    fontSize: '1rem',
  },
  textContent: {
    textAlign: 'left',
    paddingLeft: 10,
    paddingRight: 8,
  },
  title: {
    paddingBottom: 4,
  },
  messageText: {
    lineHeight: 'normal',
    whiteSpace: 'pre-wrap',
  },
  closeButton: {
    textTransform: 'initial',
    fontSize: '0.75rem',
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 8,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  endIcon: {
    marginLeft: 4,
  },
  padder: {
    width: 100,
  },
});
