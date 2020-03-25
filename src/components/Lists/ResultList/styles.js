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
    padding: `${theme.spacing.unit}px ${theme.spacing.unitDouble}px`,
  },
  titleText: {
    ...theme.typography.body2,
    textTransform: 'uppercase',
    fontWeight: 'bold',
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
