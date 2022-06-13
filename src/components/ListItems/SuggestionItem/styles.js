export default theme => ({
  container: {
    display: 'flex',
    flex: '1 1 auto',
    padding: theme.spacing(0.5, 0),
  },
  listItem: {
    padding: theme.spacing(0, 1),
  },
  textContainer: {
    display: 'flex',
    padding: theme.spacing(1, 0),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    whiteSpace: 'pre-line',
    '& p': {
      lineHeight: '18px',
    },
  },
  listIcon: {
    width: '1.5rem',
    height: '1.5rem',
    margin: theme.spacing(0.5, 1),
    marginRight: 0,
    alignSelf: 'center',
    padding: theme.spacing(0.5),
    minWidth: 0,
  },
  suggestIcon: {
    color: '#757575',
    height: 'auto',
    margin: 0,
    padding: 0,
  },
  suggestIconLabel: {
    padding: theme.spacing(1),
    color: 'rgba(0, 0, 0, 0.87)',
    textTransform: 'none',
    '&:hover': {
      color: '#2242C7',
      textDecorationLine: 'underline',
    },
  },
  subtitle: {
    fontSize: '0.625rem',
    fontWeight: 'none',
    lineHeight: '18px',
  },
  historyText: {
    color: '#660DD7',
  },
  divider: {
    marginLeft: theme.spacing(8),
    marginRight: theme.spacing(-2),
  },
  text: {
    alignSelf: 'center',
  },
  removeText: {
    color: 'inherit',
  },
  itemFocus: {
    outline: '2px solid transparent',
    boxShadow: `0 0 0 4px ${theme.palette.focusBorder.main}`,
  },
});
