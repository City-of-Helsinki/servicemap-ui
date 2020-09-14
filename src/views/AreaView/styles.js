const styles = theme => ({
  topBar: {
    height: 24,
    backgroundColor: theme.palette.primary.main,
  },
  infoText: {
    padding: theme.spacing(3),
    textAlign: 'start',
  },
  infoTitle: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: 0,
    textAlign: 'start',
    display: 'flex',
  },
  deleteLink: {
    fontSize: 14,
    color: '#3344dd',
    textDecoration: 'underline',
    marginLeft: theme.spacing(1),
  },
  list: {
    marginRight: theme.spacing(-2),
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
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
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
    paddingRight: theme.spacing(1),
  },
  addressArea: {
    padding: theme.spacing(3),
    paddingTop: theme.spacing(1),
    textAlign: 'start',
  },
  addressTitle: {
    marginBottom: theme.spacing(2),
  },
  fieldFocus: {
    outline: '2px solid transparent',
    boxShadow: `0 0 0 4px ${theme.palette.focusBorder.main}`,
  },
  addressItem: {
    fontSize: 24,
  },
  divisionItem: {
    padding: theme.spacing(2),
  },
  areaTitle: {
    display: 'flex',
    alignItems: 'center',
    padding: 0,
    paddingTop: theme.spacing(2),
    height: 30,
  },
  sidePadding: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  addressIcon: {
    fontSize: 24,
  },
  selectedAddress: {
    fontSize: 18,
  },
  subdistrictList: {
    paddingLeft: 32,
  },
  unitCategoryText: {
    textAlign: 'left',
    padding: theme.spacing.unit,
    paddingLeft: 0,
  },
  expandingElement: {
    boxShadow: 'none',
    width: '100%',
  },
  expandedUnitCategory: {
    margin: 0,
  },
  deleteButton: {
    marginLeft: theme.spacing.unitTriple,
  },
  unitListArea: {
    textAlign: 'left',
  },
  centerItems: {
    alignItems: 'center',
    padding: 0,
  },
  testPadding: {
    paddingLeft: 0,
    paddingRight: 32,
  },
});

export default styles;
