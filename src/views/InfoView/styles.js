const styles = theme => ({
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  textContainer: {
    whiteSpace: 'pre-line',
    textAlign: 'left',
    '& h3': {
      fontWeight: 'bold',
      fontSize: 17,
      padding: theme.spacing.unitDouble,
      paddingBottom: theme.spacing.unit,
    },
    '& h4': {
      fontWeight: 'bold',
      paddingLeft: theme.spacing.unitDouble,
      paddingRight: theme.spacing.unitDouble,
      paddingTop: theme.spacing.unit,
    },
  },
  text: {
    padding: theme.spacing.unitDouble,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  link: {
    color: '#0000EE',
  },
  linkButton: {
    padding: theme.spacing.unitDouble,
    paddingTop: 0,
    fontSize: 16,
    color: '#0000EE',
    textDecoration: 'underline',
  },
});

export default styles;
