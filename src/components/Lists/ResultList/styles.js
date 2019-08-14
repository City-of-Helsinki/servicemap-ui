export default theme => ({
  root: {
    height: 'auto',
    overflowY: 'auto',
    flex: '1 1 auto',
    maxWidth: '100%',
    overflowX: 'hidden',
  },
  title: {
    width: '100%',
  },
  left: {
    float: 'left',
    margin: theme.spacing.unit,
  },
  right: {
    float: 'right',
    margin: theme.spacing.unit,
  },
  list: {
    maxHeight: '100%',
  },
});
