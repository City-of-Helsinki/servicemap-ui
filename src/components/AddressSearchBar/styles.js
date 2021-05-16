const styles = theme => ({
  searchBar: {
    paddingLeft: theme.spacing(2),
    marginTop: theme.spacing(1),
    border: '1px solid #ACACAC',
    borderRadius: 4,
    width: '100%',
    height: 40,
    boxSizing: 'border-box',
    backgroundColor: '#fff',
  },
  clearButton: {
    fontSize: 22,
  },
  divider: {
    width: 1,
    height: 24,
    margin: 4,
  },
  IconButton: {
    padding: theme.spacing(1),
  },
  searchIcon: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: 22,
  },
});

export default styles;
