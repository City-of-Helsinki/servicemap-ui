
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
    margin: theme.spacing.unitHalf,
    height: 32,
    width: 32,
    minHeight: 32,
    minWidth: 32,
  },
  buttonContainer: {
    flexDirection: 'row',
    margin: `${theme.spacing.unit}px ${theme.spacing.unitDouble}px`,
    padding: theme.spacing.unitHalf,
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
    marginLeft: theme.spacing.unitHalf,
    marginRight: theme.spacing.unitHalf,
  },
});
