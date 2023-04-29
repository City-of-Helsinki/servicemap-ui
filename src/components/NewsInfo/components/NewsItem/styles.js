export default (theme) => ({
  container: {
    flex: '0 0 auto',
    marginTop: theme.spacing(1),
    width: '100%',
    border: `1px solid ${theme.palette.border.main}`,
    borderRadius: '4px',
    textAlign: 'left',
    boxShadow:
      '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
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
    backgroundColor: '#F4F4F4',
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

  newsButton: {
    width: 'fit-content',
    marginLeft: 'auto',
    marginRight: 0,
  },
});
