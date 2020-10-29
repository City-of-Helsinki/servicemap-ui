export default theme => ({
  container: {
    padding: 12,
    color: '#fff',
    display: 'flex',
    backgroundColor: theme.palette.primary.main,
  },
  icon: {
    width: 32,
    height: 32,
  },
  cancelIcon: {
    fontSize: 16,
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
    fontSize: 12,
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 8,
  },
  endIcon: {
    marginLeft: 4,
  },
  padder: {
    width: 100,
  },
});
