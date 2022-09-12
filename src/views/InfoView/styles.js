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
      fontSize: '1.063rem',
      padding: theme.spacing(2),
      paddingBottom: theme.spacing(1),
    },
    '& h4': {
      fontWeight: 'bold',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      paddingTop: theme.spacing(1),
    },
  },
  text: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  link: {
    color: theme.palette.link.main,
  },
  linkButton: {
    padding: theme.spacing(2),
    paddingTop: 0,
    fontSize: '1rem',
    color: theme.palette.link.main,
    textDecoration: 'underline',
  },
});

export default styles;
