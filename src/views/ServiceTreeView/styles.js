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
  text1: {
    // textTransform: 'uppercase',
    // fontWeight: 'bold',
    paddingLeft: 8,
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
});
