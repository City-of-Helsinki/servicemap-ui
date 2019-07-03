export default theme => ({
  root: {
    position: 'sticky',
    zIndex: 50,
    backgroundColor: theme.palette.primary.main,
    borderColor: theme.palette.primary.contrastText,
    color: theme.palette.primary.contrastText,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  indicator: {
    backgroundColor: theme.palette.primary.contrastText,
    height: 4,
  },
  resultList: {
    backgroundColor: 'white',
  },
});
