export default theme => ({
  someTitle: {
    textAlign: 'start',
  },
  someListContainer: {
    padding: theme.spacing.unit,
    paddingTop: theme.spacing.unitDouble,
    paddingLeft: 72,
  },
  someList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  someItem: {
    width: '25%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing.unitHalf,
    justifyContent: 'center',
    backgroundColor: '#fff',
    '&:hover': {
      backgroundColor: '#fff',
    },
    '&:active': {
      backgroundColor: '#fff',
    },
  },
  itemText: {
    color: '#2242C7',
    fontSize: 14,
  },
  defaultIcon: {
    height: 25,
    width: 25,
    color: '#2242C7',
  },
  verticalDividerContainer: {
    width: '12%',
    justifyContent: 'center',
  },
  verticalDivider: {
    backgroundColor: '#2242C7',
    width: 1,
    height: 25,
  },
  someDivider: {
    marginRight: -32,
  },
});
