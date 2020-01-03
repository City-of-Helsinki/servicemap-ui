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
    marginTop: theme.spacing.unitDouble,
    marginBottom: theme.spacing.unitDouble,
  },
  marginHorizontal: {
    marginLeft: theme.spacing.unitDouble,
    marginRight: theme.spacing.unitDouble,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    lineHeight: `${24}px`,
  },
  divider: {
    marginLeft: -theme.spacing.unitDouble,
    marginRight: -theme.spacing.unitDouble,
  },
});
