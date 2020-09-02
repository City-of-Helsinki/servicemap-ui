export default theme => ({
  listItem: {
    minHeight: '3.5rem',
    padding: theme.spacing(1),
  },
  textContainer: {
    padding: theme.spacing(1, 0),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    whiteSpace: 'pre-line',
  },
  link: {
    color: '#0000EE',
  },
  listIcon: {
    width: '1.5rem',
    height: '1.5rem',
    margin: theme.spacing(1),
    marginRight: theme.spacing(2),
    minWidth: 0,
  },
  divider: {
    marginLeft: theme.spacing(9),
    marginRight: theme.spacing(-2),
  },
  itemFocus: {
    outline: '2px solid transparent',
    boxShadow: `0 0 0 4px ${theme.palette.focusBorder.main}`,
  },
});
