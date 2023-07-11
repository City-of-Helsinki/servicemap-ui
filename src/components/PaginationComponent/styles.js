
// Styles
export default theme => ({
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
});
