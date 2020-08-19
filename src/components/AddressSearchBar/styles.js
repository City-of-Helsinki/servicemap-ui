const styles = theme => ({
  searchBar: {
    paddingLeft: theme.spacing.unitDouble,
    marginTop: theme.spacing.unit,
    border: '1px solid #ACACAC',
    borderRadius: 4,
    width: '100%',
    height: '80%',
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
    margiRight: theme.spacing.unitHalf,
    padding: theme.spacing.unit,
  },
  searchIcon: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: 22,
    padding: theme.spacing.unit,
  },
});

export default styles;
