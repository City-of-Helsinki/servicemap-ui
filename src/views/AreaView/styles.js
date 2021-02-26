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
    paddingLeft: 10,
  },
  subsistrictAccordion: {
    padding: 0,
    marginLeft: -11,
  },
  districtItem: {
    paddingLeft: theme.spacing(3),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  captionText: {
    color: '#000',
    fontWeight: 'normal',
  },
  loadingText: {
    height: 56,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 77,
  },
  subtitle: {
    height: 48,
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: 26,
  },
  municipalitySubtitle: {
    height: 48,
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(4),
    boxSizing: 'border-box',
  },
  listItem: {
    padding: 0,
    minHeight: theme.spacing(7),
  },
  areaItem: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  geoItem: {
    paddingLeft: theme.spacing(2),
  },
  serviceTitle: {
    paddingLeft: 63,
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
    paddingTop: 14,
    paddingBottom: 14,
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
  subdistrictContainer: {
    flexDirection: 'column',
  },
  subdistrictList: {
    paddingLeft: theme.spacing(3),
  },
  accodrion: {
    paddingLeft: theme.spacing(3),
  },
  expandingElementContent: {
    marginBottom: -1,
  },
  accordionSummary: {
    minHeight: '48px !important',
    height: 48,
    padding: 0,
  },
  accordionSummaryContent: {
    margin: 0,
  },
  textExpanded: {
    margin: 0,
  },
  deleteButton: {
    marginLeft: theme.spacing(2),
  },
  unitListArea: {
    textAlign: 'left',
    backgroundColor: 'rgba(222, 222, 222, 0.56)',
  },
  centerItems: {
    alignItems: 'center',
    padding: 0,
  },
  accoridonContent: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  unitList: {
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(1),
  },
  collapseArea: {
    backgroundColor: 'rgba(222, 222, 222, 0.12)',
  },
  districtServiceList: {
    backgroundColor: 'rgb(245,245,245)',
    boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.06)',
  },
  geogrpahicalDiststrictlist: {
    backgroundColor: 'rgb(245,245,245)',
    paddingLeft: 30,
  },
  serviceListAccordion: {
    paddingLeft: 79,
    height: 48,
  },
  iconPadding: {
    padding: theme.spacing(2.5),
    paddingLeft: 60,
  },
  areaSwitch: {
    paddingLeft: theme.spacing(2),
  },
  labelContainer: {
    marginLeft: theme.spacing(2),
  },
  unitsAccordion: {
    height: 48,
    backgroundColor: 'rgba(222, 222, 222, 0.56)',
  },
  checkBoxIcon: {
    margin: 2,
    width: 18,
    height: 18,
    backgroundColor: '#fff',
    border: '0.5px solid #DEDEDE',
    boxShadow: 'inset 1px 1px 2px rgba(0, 0, 0, 0.05)',
    borderRadius: 1,
  },
  disablePadding: {
    padding: 0,
  },
  customSwitch: {
    overflow: 'visible',
  },
  servciceList: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: 77,
    backgroundColor: 'rgb(230,243,254)',
  },
  serviceListPadding: {
    paddingLeft: 72,
  },
  serviceDivider: {
    marginLeft: -72,
  },
  addressInfoContainer: {
    backgroundColor: '#E3F3FF',
    textAlign: 'left',
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(4),
  },
  addressInfoText: {
    paddingLeft: 62,
  },
  addressInfoIconArea: {
    display: 'flex',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  addressInfoIcon: {
    width: 50,
    paddingRight: theme.spacing(1.5),
  },
});

export default styles;
