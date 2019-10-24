export default theme => ({
  addressIcon: {
    fontSize: 36,
  },
  mapButton: {
    float: 'right',
    display: 'flex',
    marginRight: 8,
    padding: '0px 20px 0px 12px',
    height: 48,
    width: 'auto',
  },
  mapIcon: {
    marginLeft: 0,
    marginRight: 12,
  },
  titleIcon: {
    fontSize: 28,
    height: 24,
    width: 24,
    marginLeft: 0,
    marginRight: 0,
  },
  topBar: {
    backgroundColor: theme.palette.primary.main,
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
});
