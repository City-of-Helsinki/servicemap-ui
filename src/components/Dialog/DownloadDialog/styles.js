export default theme => ({
  container: {
    '& p': {
      marginBottom: theme.spacing(2),
    },
  },
  croppingContainer: {
    margin: theme.spacing(2, 0),
    '& p': {
      marginBottom: theme.spacing(1),
    },
  },
  croppingText: {
    display: 'inline-block',
    backgroundColor: '#DEDEDE',
    width: 'fit-content',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    margin: `${theme.spacing(1)}px 0`,
  },
  croppingTitle: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  downloadIcon: {
    marginLeft: theme.spacing(1.5),
    fontSize: 'inherit',
  },
  formControlGroup: {
    flexDirection: 'row',
    '& p': {
      margin: 0,
    }
  },
  formControlLabel: {
    color: 'rgba(0, 0, 0, 0.87)',
  },
  topMargin: {
    marginTop: theme.spacing(3),
  },
  icon: {
  },
  unitCount: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'rgba(222, 222, 222, 0.15)',
    width: 'fit-content',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    margin: `${theme.spacing(1)}px 0`,
    '& img': {
      marginRight: theme.spacing(1),
    },
    '& p': {
      margin: 0,
    },
  },
});
