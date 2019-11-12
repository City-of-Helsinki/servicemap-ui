export default theme => ({
  container: {
    display: 'flex',
    flex: '1 0 auto',
  },
  listItem: {
    padding: `${theme.spacing.unit}px 0`,
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
    margin: '0.5rem 1rem',
  },
  suggestIcon: {
    height: 'auto',
    margin: 0,
    padding: 0,
  },
  suggestIconLabel: {
    padding: theme.spacing.unit,
  },
  divider: {
    marginLeft: theme.spacing.unit * 9,
  },
});
