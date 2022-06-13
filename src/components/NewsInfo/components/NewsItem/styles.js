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
      padding: `0 ${theme.spacing(2)}`,
    },
    '& .column': {
      display: 'flex',
      flexDirection: 'column',
    },
    '& .padding': {
      padding: theme.spacing(1),
    },
    '& p': {
      marginBottom: theme.spacing(1.5),
    },
    '& p:last-child': {
      marginBottom: 0,
    },
    '& a': {
      textDecoration: 'underline',
    },
  },
  bottomContent: {
    padding: theme.spacing(1.5, 2.5, 2, 2.5),
  },
  content: {
    padding: theme.spacing(2),
    width: '100%',
  },
  titleContainer: {
    // paddingTop: theme.spacing(2),
  },
  icon: {
    margin: theme.spacing(1, 1.5),
    width: 40,
    height: 40,
    borderRadius: '50%',
    boxShadow: '0 4px 8px 0 #898989',
  },
  image: {
    objectFit: 'cover',
    width: '100%',
    maxHeight: 200,
  },
  hidePaddingTop: {
    paddingTop: '0 !important',
  },
  hidePaddingBottom: {
    paddingBottom: '0 !important',
  },
});
