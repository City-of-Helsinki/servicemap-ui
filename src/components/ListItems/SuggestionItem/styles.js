export default theme => ({
  container: {
    display: 'flex',
    flex: '1 1 auto',
    padding: `${theme.spacing.unitHalf}px 0`,
  },
  listItem: {
    padding: '0',
    paddingTop: theme.spacing.unitHalf,
  },
  textContainer: {
    padding: 0,
    marginLeft: theme.spacing.unitDouble,
    marginRight: theme.spacing.unitDouble,
    whiteSpace: 'pre-line',
    '& p': {
      lineHeight: '18px',
    },
  },
  listIcon: {
    width: '1.5rem',
    height: '1.5rem',
    margin: '0.5rem 1rem',
    marginRight: 0,
    alignSelf: 'center',
  },
  suggestIcon: {
    height: 'auto',
    margin: 0,
    padding: 0,
  },
  suggestIconLabel: {
    padding: theme.spacing.unit,
  },
  subtitle: {
    fontSize: '10px',
    fontWeight: 'none',
    lineHeight: '18px',
  },
  divider: {
    marginLeft: theme.spacing.unit * 6,
  },
});
