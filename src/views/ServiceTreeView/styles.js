export default theme => ({
  title: {
    fontSize: 18,
    color: '#fff',
    flex: '1 1 auto',
    textTransform: 'capitalize',
    textAlign: 'left',
    paddingBottom: 8,
  },
  topArea: {
    background: theme.palette.background.main,
    paddingTop: 23,
    paddingLeft: 21,
    paddingRight: 21,
    paddingBottom: theme.spacing.unitDouble,
  },
  mainContent: {
    textAlign: 'left',
  },
  listItem: {
    alignSelf: 'center',
    height: 60,
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
    paddingLeft: 12,
  },
  level0: {
    borderBottom: '0.5px solid rgba(151, 151, 151, 0.5)',
    backgroundColor: '#fff',
    '& p': {
      fontWeight: 'bold',
    },
  },
  level1: {
    backgroundColor: '#e3f3ff',
    borderBottom: '0.5px solid #fff',
    '& p': {
      fontWeight: 'bold',
    },
  },
  level2: {
    borderBottom: '0.5px solid #fff',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: '15px',
    lineHeight: '18px',
  },
  iconRight: {
    marginLeft: 'auto',
    marginRight: theme.spacing.unitDouble,
    fontSize: 30,
  },
  checkBox: {
    width: 40,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    position: 'relative',
    flexShrink: 0,
  },
  checkBoxIcon: {
    margin: -1,
    width: 15,
    height: 15,
    backgroundColor: '#fff',
    border: '1px solid #323232;',
    borderRadius: 1,
  },
  checkBoxLines: {
    height: 'inherit',
    width: 'inherit',
    position: 'absolute',
  },
  checkboxPadding: {
    padding: theme.spacing.unitHalf,
  },
  outerLines: {
    height: '100%',
    width: 26,
    flexShrink: 0,
  },
  listClickArea: {
    width: '100%',
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    marginRight: theme.spacing.unitHalf,
  },
  searchButton: {
    marginTop: theme.spacing.unitDouble,
    marginBottom: 10,
    marginLeft: 21,
  },
  seleectionList: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  selectionText: {
    fontSize: 12,
    paddingRight: theme.spacing.unitDouble,
    color: '#fff',
  },
  deleteText: {
    fontSize: 12,
    paddingRight: theme.spacing.unit,
    color: '#fff',
  },
  deleteIcon: {
    color: '#fff',
    height: 14,
    width: 14,
  },
  bold: {
    fontWeight: 'bold',
  },
  white: {
    color: '#fff',
  },
  right: {
    marginLeft: 'auto',
  },
  infoContainer: {
    color: '#fff',
    display: 'flex',
  },
  infoText: {
    color: 'inherit',
    marginBottom: 12,
    marginTop: 12,
  },
  selectionsButton: {
    display: 'flex',
  },
  whiteDivider: {
    backgroundColor: '#fff',
  },
});
