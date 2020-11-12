export default theme => ({
  buttonContainer: {
    padding: theme.spacing(1),
  },
  wrapper: {
    position: 'relative',
    background: 'white',
    color: 'black',
    top: 0,
    left: 0,
    right: 0,
    padding: 24,
    minHeight: '100%',
    zIndex: 10000,
  },
  container: {
    maxWidth: 900,
    margin: 'auto',
  },
  map: {
    position: 'relative',
    height: 500,
    width: '100%',
    display: 'block',
  },
  table: {
    pageBreakAfter: 'always',
    '& thead': {
      fontWeight: 'bold',
    },
  },
});
