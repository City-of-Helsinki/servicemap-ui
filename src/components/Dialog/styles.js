export default theme => ({
  closeButton: {
    ...theme.typography.body2,
    marginRight: 0,
  },
  closeButtonTop: {
    alignSelf: 'start',
  },
  muiRoot: {
    padding: 0,
    overflow: 'visible',
  },
  root: {
    padding: theme.spacing(3),
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    flex: '0 1 auto',
    wordBreak: 'break-word',
    padding: 0,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  topArea: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
});
