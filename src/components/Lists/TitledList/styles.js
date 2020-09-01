export default theme => ({
  left: {
    textAlign: 'left',
    lineHeight: 'inherit',
  },
  right: {
    textAlign: 'right',
    lineHeight: 'inherit',
  },
  marginVertical: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  marginHorizontal: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    lineHeight: `${24}px`,
  },
  divider: {
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(-2),
  },
  loadingText: {
    margin: 20,
    height: 34,
  },
});
