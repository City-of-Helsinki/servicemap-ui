export default theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    minHeight: 44,
    background: theme.palette.background.main,
    boxShadow: '0 2px 4px 0 rgba(0,0,0,0.5)',
    color: '#fff',
    padding: theme.spacing.unit,
  },
  textBar: {
    paddingLeft: 36,
  },
  title: {
    fontSize: 18,
    color: 'inherit',
    flex: '1 1 auto',
    textTransform: 'none',
    textAlign: 'left',
    marginLeft: 10,
    '&:focus': {
      outlineStyle: 'none',
    },
  },
  iconButton: {
    display: 'flex',
    color: 'inherit',
    flex: '0 1 auto',
    padding: theme.spacing.unit,
    marginLeft: theme.spacing.unitHalf,
  },
  buttonFocus: {
    outline: '2px solid transparent',
    boxShadow: `0 0 0 4px ${theme.palette.primary.highContrast}`,
  },
  colorLight: {
    color: '#000',
  },
  distance: {
    fontSize: 16,
    color: 'inherit',
    marginLeft: 'auto',
    paddingLeft: theme.spacing.unit,
    paddingTop: 4,
    marginRight: theme.spacing.unit,
    minWidth: 50,
  },
});
