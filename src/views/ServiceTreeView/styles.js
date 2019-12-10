export default theme => ({
  listItem: {
    alignSelf: 'center',
    height: 60,
    borderBottom: '0.5px solid rgba(151, 151, 151, 0.5)',
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
  },
  level0: {
    backgroundColor: '#fff',
  },
  level1: {
    backgroundColor: '#e3f3ff;',
  },
  level2: {
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: '15px',
    lineHeight: '18px',
  },
  text0: {
    // textTransform: 'uppercase',
    paddingLeft: 8,
    fontWeight: 'bold',
    // letterSpacing: -0.5,
  },
  text1: {
    fontWeight: 'bold',
    // letterSpacing: -0.5,
  },
  text2: {
    // letterSpacing: 0.5,
  },
  iconRight: {
    marginLeft: 'auto',
    marginRight: 16,
    fontSize: 36,
  },
  checkBox: {
    padding: 0,
    // backgroundColor: '#fff',
    // paddingLeft: 0,
    // paddingRight: 16,
  },
  checkBoxIcon: {
    margin: -1,
    width: 15,
    height: 15,
    backgroundColor: '#fff',
    border: '1px solid #323232;',
    borderRadius: 1,
  },
  topArea: {
    backgroundColor: theme.palette.primary.main,
    paddingTop: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
  infoText: {
    color: 'inherit',
    marginBottom: 12,
  },
});
