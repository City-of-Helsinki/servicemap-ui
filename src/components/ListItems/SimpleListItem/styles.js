export default theme => ({
  listItem: {
    minHeight: '3.5rem',
    padding: theme.spacing.unit,
    color: '#000',
    '&.dark': {
      paddingLeft: 26,
      color: '#fff',
    },
  },
  textContainer: {
    padding: `${theme.spacing.unit}px 0`,
    marginLeft: theme.spacing.unitDouble,
    marginRight: theme.spacing.unitDouble,
    whiteSpace: 'pre-line',
  },
  link: {
    color: '#0000EE',
  },
  whiteText: {
    color: '#fff',
  },
  listIcon: {
    width: '1.5rem',
    height: '1.5rem',
    margin: theme.spacing.unit,
    marginRight: theme.spacing.unitDouble,
    color: 'inherit',
  },
  divider: {
    marginLeft: theme.spacing.unit * 9,
    marginRight: -theme.spacing.unitDouble,
  },
  itemFocus: {
    outline: '2px solid transparent',
    boxShadow: `0 0 0 4px ${theme.palette.focusBorder}`,
  },
});
