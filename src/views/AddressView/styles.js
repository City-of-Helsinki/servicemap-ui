export default theme => ({
  addressIcon: {
    fontSize: 36,
  },
  topArea: {
    backgroundColor: '#fff',
    textAlign: 'left',
  },
  mapButton: {
    marginTop: theme.spacing.unitTriple,
    marginLeft: theme.spacing.unitTriple,
    marginBottom: theme.spacing.unit,
  },
  mapIcon: {
    marginLeft: 0,
    marginRight: 12,
  },
  titleIcon: {
    fontSize: 28,
    height: 24,
    width: 24,
    marginLeft: 0,
    marginRight: 0,
  },
  districtListcontainer: {
    paddingLeft: theme.spacing.unitDouble,
    paddingRight: theme.spacing.unitDouble,
  },
  servicesTitle: {
    padding: theme.spacing.unit,
    margin: `${theme.spacing.unit}px ${theme.spacing.unitDouble}px`,
    textAlign: 'left',
  },
  areaLink: {
    textDecoration: 'underline',
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    '&:hover': {
      opacity: '0.7',
    },
  },
});
