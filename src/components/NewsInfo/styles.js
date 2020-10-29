export default theme => ({
  container: {
    flex: '0 0 auto',
    margin: theme.spacing(1),
    width: '100%',
    border: `${theme.palette.detail.alpha} solid 0.5px`,
    textAlign: 'left',
    '& .row': {
      display: 'flex',
      alignItems: 'center',
      padding: `0 ${theme.spacing(2)}px`,
    },
    '& .column': {
      display: 'flex',
      flexDirection: 'column',
    },
    '& .padding': {
      padding: theme.spacing(2),
    },
    '& p': {
      marginBottom: theme.spacing(1.5),
    },
    '& a': {
      textDecoration: 'underline',
    },
  },
  content: {
    padding: theme.spacing(2),
    width: '100%',
  },
  titleContainer: {
    paddingTop: theme.spacing(2),
  },
  icon: {
    marginRight: theme.spacing(1),
    width: 52,
    height: 52,
  },
  image: {
    objectFit: 'cover',
    width: '100%',
    maxHeight: '400px',
  },
  hidePaddingTop: {
    paddingTop: '0 !important',
  },
  hidePaddingBottom: {
    paddingBottom: '0 !important',
  },
});
