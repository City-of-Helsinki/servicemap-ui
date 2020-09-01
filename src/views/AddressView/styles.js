export default theme => ({
  addressIcon: {
    fontSize: 36,
  },
  topArea: {
    backgroundColor: '#fff',
    textAlign: 'left',
  },
  mapButton: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(3),
    marginBottom: theme.spacing(1),
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
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  servicesTitle: {
    padding: theme.spacing(1),
    margin: theme.spacing(1, 2),
    textAlign: 'left',
  },
  areaLink: {
    textDecoration: 'underline',
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    '&:hover': {
      opacity: '0.7',
    },
  },
});
