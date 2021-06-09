export default theme => ({
  adjustLeft: {
    marginLeft: theme.spacing(-2),
  },
  divider: {
    marginLeft: -32,
    marginRight: -32,
  },
  list: {
    paddingLeft: theme.spacing(3),
    listStyleType: 'disc',
  },
  listIcon: {
    alignSelf: 'flex-start',
    margin: 0,
    color: theme.palette.primary.main,
    marginTop: '-3px',
    marginRight: theme.spacing(2),
    minWidth: 0,
  },
  infoIcon: {
    paddingRight: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  listItem: {
    paddingLeft: theme.spacing(1),
  },
  descriptionItem: {
    marginLeft: theme.spacing(3),
  },
  listTitle: {
    fontWeight: 'bold',
  },
  noShortcomingsColor: {
    color: theme.palette.primary.main,
  },
  title: {
    marginBottom: theme.spacing(1),
  },
  descriptionsTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  aSettingsContainer: {
    display: 'flex',
    padding: theme.spacing(2),
    paddingLeft: 0,
    paddingRight: 0,
    textAlign: 'left',
  },
  settingsLink: {
    lineHeight: '24px',
    textDecorationLine: 'underline',
    color: '#2242C7',
  },
  infoContainer: {
    display: 'flex',
    padding: theme.spacing(2),
    paddingLeft: 0,
    paddingRight: 0,
    alignItems: 'center',
  },
});
