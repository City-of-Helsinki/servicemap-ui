const styles = theme => ({
  topBar: {
    height: 24,
    backgroundColor: theme.palette.primary.main,
  },
  infoText: {
    padding: theme.spacing.unitTriple,
    textAlign: 'start',
  },
  infoTitle: {
    padding: theme.spacing.unit,
    paddingLeft: theme.spacing.unitTriple,
    paddingTop: 0,
    textAlign: 'start',
  },
  list: {
    marginRight: -16,
  },
  districtItem: {
    padding: 0,
    paddingTop: 4,
    paddingBottom: 4,
  },
  captionText: {
    color: '#000',
    fontWeight: 'normal',
  },
  subtitle: {
    height: 49,
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  categoryItem: {
    paddingRight: 32,
    flexDirection: 'column',
  },
  categoryItemTitle: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  categoryItemContent: {
    paddingLeft: 50,
    marginRight: -32,
    width: '100%',
    boxSizing: 'border-box',
  },
  itemClickArea: {
    width: '100%',
  },
  bold: {
    fontWeight: 'bold',
  },
  right: {
    marginLeft: 'auto',
  },
  rightPadding: {
    paddingRight: theme.spacing.unit,
  },
  addressArea: {
    margin: 32,
    textAlign: 'start',
    height: 270,
    paddingBottom: theme.spacing.unitDouble,
  },
  addressTitle: {
    marginBottom: theme.spacing.unitDouble,
  },
  searchBar: {
    paddingLeft: 8,
    border: '1px solid #ACACAC',
    borderRadius: 4,
    width: '100%',
    height: 54,
    boxSizing: 'border-box',
  },
  cancelButton: {
    fontSize: 16,
  },
  addressItem: {
    fontSize: 24,
  },
  containerPadding: {
    padding: theme.spacing.unitDouble,
    paddingTop: 0,
  },
  divider: {
    marginLeft: -theme.spacing.unitDouble,
    marginRight: -theme.spacing.unitDouble,
  },
  addressIcon: {
    fontSize: 24,
  },
  selectedAddress: {
    fontSize: 18,
  },
});

export default styles;
