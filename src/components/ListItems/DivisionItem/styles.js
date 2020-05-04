export default theme => ({
  containerInner: {
    display: 'flex',
    flexDirection: 'row',
    padding: `0 ${theme.spacing.unit}px`,
  },
  content: {
    alignSelf: 'center',
    flex: '1 1 auto',
  },
  divisionAddress: {
    color: 'black',
    fontWeight: 'normal',
  },
  divisionDistance: {
    color: 'black',
    fontWeight: 'normal',
  },
  divisionTitle: {
    fontWeight: 'bold',
    paddingLeft: theme.spacing.unitDouble,
    marginBottom: theme.spacing.unit,
  },
  emergencyContent: {
    display: 'flex',
    flexDirection: 'row',
    padding: `0 ${theme.spacing.unit}px`,
    marginLeft: theme.spacing.unit * 5,
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
    marginRight: theme.spacing.unitDouble,
  },
  listItem: {
    alignItems: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing.unit,
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
