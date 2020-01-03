export default theme => ({
  listItem: {
    minHeight: '3.5rem',
    padding: 0,
  },
  textContainer: {
    padding: 0,
    marginLeft: theme.spacing.unitDouble,
    marginRight: theme.spacing.unitDouble,
    whiteSpace: 'pre-line',
  },
  link: {
    color: '#0000EE',
  },
  listIcon: {
    width: '1.5rem',
    height: '1.5rem',
    margin: '1rem',
  },
  divider: {
    marginLeft: theme.spacing.unit * 9,
    marginRight: -theme.spacing.unitDouble,
  },
});
