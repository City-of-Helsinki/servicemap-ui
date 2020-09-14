
// Styles
export default theme => ({
  arrowIcon: {
    fontSize: 18,
  },
  arrowFlip: {
    transform: 'scaleX(-1)',
  },
  borderBlack: {
    border: '1px solid #000000',
  },
  button: {
    margin: theme.spacing(0.5),
    height: 32,
    width: 32,
    minHeight: 32,
    minWidth: 32,
  },
  buttonContainer: {
    flexDirection: 'row',
    margin: theme.spacing(1, 2),
    padding: theme.spacing(0.5),
  },
  list: {
    display: 'inherit',
    flexDirection: 'row',
    listStyleType: 'none',
    margin: 0,
    padding: 0,
  },
  listContainer: {
    flexDirection: 'row',
    margin: 0,
  },
  pageElement: {
    color: 'black',
    cursor: 'pointer',
    fontWeight: 'normal',
    textDecoration: 'none',
  },
  pageElementActive: {
    cursor: 'auto',
    fontWeight: 'normal',
    textDecoration: 'underline',
  },
  pageItem: {
    margin: 0,
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  },
});
