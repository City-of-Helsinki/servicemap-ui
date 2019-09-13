
// Styles
export default theme => ({
  button: {
    padding: `${theme.spacing.unitHalf}px ${theme.spacing.unit}px`,
    margin: theme.spacing.unitHalf,
    minWidth: 'auto',
  },
  buttonContainer: {
    flexDirection: 'row',
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
    textDecoration: 'none',
  },
  pageElementActive: {
    color: 'red',
    cursor: 'auto',
    textDecoration: 'underline',
  },
  pageItem: {
    margin: 0,
    marginLeft: theme.spacing.unitHalf,
    marginRight: theme.spacing.unitHalf,
  },
});
