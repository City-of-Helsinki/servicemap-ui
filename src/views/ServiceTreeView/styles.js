export default theme => ({
  listItem: {
    border: '1px solid #fff',
    display: 'block',
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
    paddingLeft: 8,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  text3: {
    paddingLeft: 8,
    letterSpacing: 0.5,
  },
  checkbox: {
    paddingRight: theme.spacing.unitDouble,
  },
  clickArea: {
    width: '100%',
    paddingTop: 8,
    paddingBottom: 8,
  },
  checkboxIcon: {
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
  infoArea: {
    display: 'flex',
    paddingLeft: theme.spacing.unitDouble,
    paddingRight: theme.spacing.unitDouble,
    marginBottom: 12,
  },
  infoText: {
    color: '#fff',
  },
  right: {
    marginLeft: 'auto',
  },
  nodeSearchButton: {
    width: 250,
    height: 46,
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 5,
    '&:disabled': {
      backgroundColor: '#bdbdbd',
    },
  },
});
