const styles = (theme) => ({
  listLevelTwo: {
    backgroundColor: 'rgb(250,250,250)',
  },
  listLevelThree: {
    backgroundColor: 'rgb(245,245,245)',
  },
  listLevelFour: {
    backgroundColor: 'rgb(240,240,240)',
  },
  listLevelFive: {
    backgroundColor: 'rgb(235,235,235)',
  },
  listLevelSix: {
    backgroundColor: 'rgb(230,230,230)',
  },
  topBar: {
    height: 24,
    backgroundColor: theme.palette.primary.main,
  },
  infoText: {
    padding: theme.spacing(2),
    paddingTop: 0,
    textAlign: 'start',
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  },
  infoTitle: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: 0,
    textAlign: 'start',
    display: 'flex',
  },
  list: {
    paddingLeft: 10,
  },
  listNoPadding: {
    padding: 0,
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
    '& li:last-of-type': {
      borderBottom: 'none',
    },
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
  },
  subtitle: {
    height: 48,
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: 26,
  },
  serviceTabCategoryList: {
    '& > li:last-of-type': {
      borderBottom: 'none',
    },
  },
  serviceTabSubtitle: {
    height: 48,
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(9),
  },
  municipalityAdjustedCheckboxPadding: {
    paddingLeft: theme.spacing(2),
    marginRight: 0,
    display: 'flex',
    flex: '1 1 auto',
  },
  statisticalAreaAdjustedCheckboxPadding: {
    paddingLeft: theme.spacing(6),
    display: 'flex',
    flex: '1 1 auto',
  },
  statisticalCityAccordion: {
    paddingLeft: theme.spacing(9),
  },
  statisticalDistrictListItemLabel: {
    margin: `${theme.spacing(1)} 0`,
  },
  statisticalDistrictListItemLabelInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  statisticalCategoryAccordion: {
    paddingLeft: theme.spacing(9),
  },
  statisticalLayerAccordion: {
    paddingLeft: theme.spacing(7),
  },
  statisticalUnitInfo: {
    backgroundColor: 'rgba(222, 222, 222, 0.56)',
    padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
    paddingLeft: theme.spacing(9),
    fontWeight: 'normal',
    color: 'black',
  },
  municipalityCheckbox: {
    padding: 0,
    margin: 0,
  },
  municipalitySubtitleBase: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    boxSizing: 'border-box',
  },
  municipalitySubtitle: {
    paddingLeft: theme.spacing(9),
  },
  municipalitTitle: {
    paddingLeft: theme.spacing(7),
  },
  listItem: {
    padding: 0,
    minHeight: theme.spacing(7),
  },
  areaItem: {
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(2),
  },
  geoItem: {
    paddingLeft: theme.spacing(2),
  },
  geographicalCategoryListAccordion: {
    paddingLeft: theme.spacing(7),
  },
  serviceTitle: {
    paddingLeft: theme.spacing(10),
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
  addressTitle: {
    marginBottom: theme.spacing(2),
  },
  fieldFocus: {
    outline: '2px solid transparent',
    boxShadow: `0 0 0 4px ${theme.palette.focusBorder.main}`,
  },
  addressItem: {
    fontSize: '1.5rem',
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
    fontSize: '1.125rem',
  },
  statisticalCategoryTitle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: '1 1 auto',
  },
  subdistrictContainer: {
    flexDirection: 'column',
  },
  subdistrictList: {
    paddingLeft: theme.spacing(3),
  },
  accordion: {
    paddingLeft: theme.spacing(9),
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
    paddingLeft: theme.spacing(10),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(1),
  },
  collapseArea: {
    backgroundColor: 'rgba(222, 222, 222, 0.12)',
  },
  districtServiceList: {
    boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.06)',
  },
  serviceTabServiceList: {
    paddingLeft: theme.spacing(10),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  icon: {
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(0),
  },
  iconPadding: {
    padding: theme.spacing(2.5),
    paddingLeft: theme.spacing(7),
  },
  areaSwitch: {
    paddingLeft: theme.spacing(2),
    display: 'inline-flex',
    alignItems: 'center',
    marginLeft: -11,
    verticalAlign: 'middle',
  },
  labelContainer: {
    marginLeft: theme.spacing(2),
  },
  unitsAccordion: {
    height: 48,
    backgroundColor: 'rgba(222, 222, 222, 0.56)',
  },
  checkboxPadding: {
    paddingLeft: theme.spacing(2),
  },
  checkBoxIcon: {
    margin: 2,
    width: 18,
    height: 18,
    backgroundColor: '#fff',
    border: '0.5px solid #949494',
    boxShadow: 'inset 1px 1px 2px rgba(0, 0, 0, 0.05)',
    borderRadius: 2,
  },
  disablePadding: {
    padding: 0,
  },
  customSwitch: {
    overflow: 'visible',
  },
  switchBorder: {
    border: '1px solid #949494',
  },
  serviceFilter: {
    backgroundColor: theme.palette.white.main,
    flex: '1 0 auto',
  },
  serviceFilterButton: {
    flex: '0 0 auto',
    borderRadius: 0,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    boxShadow: 'none',
    padding: theme.spacing(1, 2),
    textTransform: 'none',
    '& svg': {
      fontSize: 20,
      marginBottom: theme.spacing(0.5),
    },
    flexDirection: 'column',
  },
  serviceFilterButtonFocus: {
    boxShadow: `0 0 0 4px ${theme.palette.focusBorder.main} !important`,
  },
  serviceFilterButtonLabel: {
    flexDirection: 'column',
  },
  serviceFilterContainer: {
    padding: theme.spacing(2),
    paddingLeft: 72,
    display: 'flex',
    flexDirection: 'column',
  },
  serviceFilterText: {
    paddingBottom: theme.spacing(1),
    fontWeight: 'bold',
  },
  serviceFilterInput: {
    margin: theme.spacing(1),
  },
  servciceList: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: 77,
    backgroundColor: 'rgb(230,243,254)',
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
