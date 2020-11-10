export default theme => ({
  croppingContainer: {
    margin: theme.spacing(2, 0),
    '& p': {
      marginBottom: theme.spacing(1),
    },
  },
  croppingText: {
    marginLeft: theme.spacing(2),
  },
  formControlGroup: {
    flexDirection: 'row',
  },
  formControlLabel: {
    color: 'rgba(0, 0, 0, 0.87)',
  },
});
