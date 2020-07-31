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
    paddingRight: theme.spacing.unitTriple,
    paddingTop: 0,
    textAlign: 'start',
    display: 'flex',
  },
  deleteLink: {
    fontSize: 14,
    color: '#3344dd',
    textDecoration: 'underline',
    marginLeft: theme.spacing.unit,
  },
  list: {
    marginRight: -theme.spacing.unitDouble,
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
    paddingLeft: 32,
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
    padding: theme.spacing.unitTriple,
    paddingTop: theme.spacing.unit,
    textAlign: 'start',
  },
  addressTitle: {
    marginBottom: theme.spacing.unitDouble,
  },
  fieldFocus: {
    outline: '2px solid transparent',
    boxShadow: `0 0 0 4px ${theme.palette.focusBorder}`,
  },
  addressItem: {
    fontSize: 24,
  },
  divisionItem: {
    padding: theme.spacing.unitDouble,
  },
  areaTitle: {
    display: 'flex',
    alignItems: 'center',
    padding: 0,
    paddingTop: theme.spacing.unitDouble,
    height: 30,
  },
  sidePadding: {
    paddingLeft: theme.spacing.unitDouble,
    paddingRight: theme.spacing.unitDouble,
  },
  addressIcon: {
    fontSize: 24,
  },
  selectedAddress: {
    fontSize: 18,
  },
  unitCategoryText: {
    textAlign: 'left',
    padding: theme.spacing.unit,
    paddingLeft: 0,
  },
  expandedUnitCategory: {
    margin: 0,
  },
  centerItems: {
    alignItems: 'center',
  },
});

export default styles;
