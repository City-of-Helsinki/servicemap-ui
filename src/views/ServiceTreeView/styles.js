export default theme => ({
  listItem: {
    alignSelf: 'center',
    height: 60,
    border: '1px solid #fff',
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
  },
  level1: {
    backgroundColor: '#c2e0fc',
  },
  level2: {
    backgroundColor: '#e6f3fe',
  },
  level3: {
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: '15px',
    lineHeight: '18px',
  },
  text1: {
    // textTransform: 'uppercase',
    paddingLeft: 8,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  text2: {
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  text3: {
    letterSpacing: 0.5,
  },
  iconRight: {
    marginLeft: 'auto',
    marginRight: 16,
  },
  checkBox: {
    // backgroundColor: '#fff',
    paddingLeft: 16,
    paddingRight: 16,
  },
  checkBoxIcon: {
    margin: 3,
    width: 14,
    height: 14,
    backgroundColor: '#fff',
    border: '2px solid #5b6772',
    borderRadius: 2,
  },
  topArea: {
    backgroundColor: theme.palette.primary.main,
  },
  bold: {
    fontWeight: 'bold',
  },
  infoText: {
    color: 'inherit',
    marginBottom: 12,
  },
});
