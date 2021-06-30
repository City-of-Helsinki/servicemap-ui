export default theme => ({
  containerInner: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(0, 1.5),
  },
  content: {
    alignSelf: 'center',
    flex: '1 1 auto',
  },
  divisionAddress: {
    color: 'black',
    display: 'block',
    fontWeight: 'normal',
  },
  divisionDistance: {
    color: 'black',
    fontWeight: 'normal',
  },
  divisionTitle: {
    fontWeight: 'bold',
    paddingLeft: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  emergencyContent: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(0, 1),
    marginLeft: theme.spacing(5),
    marginRight: 60,
  },
  emergencyTypography: {
    color: 'black',
    fontWeight: 'normal',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  listItem: {
    alignItems: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1),
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
  },
  li: {
    listStyleType: 'none',
  },
  linkButton: {
    flexDirection: 'column',
    alignItems: 'initial',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  weightBold: {
    fontWeight: 'bold',
  },
});
