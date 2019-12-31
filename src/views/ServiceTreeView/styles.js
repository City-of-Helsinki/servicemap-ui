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
    background: 'linear-gradient(340.58deg, #0B7BED 0%, #146CE8 67.04%, #1964E6 100%)',
    paddingTop: 23,
    paddingLeft: 21,
    paddingBottom: 16,
  },
  mainContent: {
    textAlign: 'left',
  },
  listItem: {
    alignSelf: 'center',
    height: 60,
    borderBottom: '0.5px solid rgba(151, 151, 151, 0.5)',
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
    paddingLeft: 12,
  },
  level0: {
    backgroundColor: '#fff',
    '& p': {
      fontWeight: 'bold',
    },
  },
  level1: {
    backgroundColor: '#e3f3ff',
    '& p': {
      fontWeight: 'bold',
    },
  },
  level2: {
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: '15px',
    lineHeight: '18px',
  },
  iconRight: {
    marginLeft: 'auto',
    marginRight: 16,
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
  outerLines: {
    height: '100%',
    width: 26,
    flexShrink: 0,
  },
  listClickArea: {
    width: '100%',
    paddingTop: 8,
    paddingBottom: 8,
  },
  searchButton: {
    marginTop: 16,
    marginBottom: 10,
    marginLeft: 21,
  },
  selectionText: {
    fontSize: 12,
    paddingRight: theme.spacing.unitDouble,
    color: '#fff',
  },
  deleteText: {
    fontSize: 10,
    paddingRight: theme.spacing.unitDouble,
    color: '#fff',
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
});
