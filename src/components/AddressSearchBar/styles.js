const styles = theme => ({
  searchBar: {
    paddingLeft: theme.spacing(2),
    marginTop: theme.spacing(1),
    border: '1px solid #ACACAC',
    borderRadius: 4,
    width: '100%',
    height: '80%',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
  },
  clearButton: {
    fontSize: '1.375rem',
  },
  divider: {
    width: 1,
    height: 24,
    margin: 4,
  },
  IconButton: {
    margiRight: theme.spacing(0.5),
    padding: theme.spacing(1),
  },
  searchIcon: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '1.375rem',
    padding: theme.spacing(1),
  },
});

export default styles;
