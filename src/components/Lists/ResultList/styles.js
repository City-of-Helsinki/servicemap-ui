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
    display: 'flex',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    overflow: 'hidden',
    padding: theme.spacing(1, 2),
  },
  titleText: {
    ...theme.typography.body2,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  left: {
    float: 'left',
    margin: theme.spacing(1),
  },
  right: {
    float: 'right',
    margin: theme.spacing(1),
    whiteSpace: 'nowrap',
  },
  list: {
    maxHeight: '100%',
  },
});
