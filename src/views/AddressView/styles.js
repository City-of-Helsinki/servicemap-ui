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
    color: theme.palette.link.main,
    textDecoration: 'underline',
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    '&:hover': {
      opacity: '0.7',
    },
  },
  simpleItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    paddingLeft: theme.spacing(3),
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
  },
  simpleTitle: {
    marginBottom: theme.spacing(0.5),
  },
  itemTextContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
  areaIcon: {
    fontSize: 20,
    marginLeft: 0,
    marginRight: theme.spacing(2),
  },
  divider: {
    listStyleType: 'none',
  },
});
