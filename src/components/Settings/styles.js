export default theme => ({
  button: {
    textTransform: 'none',
  },
  buttonLabel: {
    display: 'flex',
    flexDirection: 'column',
  },
  closeButtonContainer: {
    alignItems: 'center',
    display: 'flex',
    flex: '0 0 auto',
    justifyContent: 'space-between',
  },
  closeButton: {
    margin: theme.spacing.unit,
    padding: theme.spacing.unitHalf,
  },
  container: {
    backgroundColor: '#fff',
    overflow: 'auto',
  },
  fixedMargin: {
    marginTop: 60,
  },
  hidden: {
    display: 'none',
  },
  icon: {
    marginLeft: 20,
    marginRight: 32,
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  radioLabel: {
    margin: 0,
    paddingTop: 8,
    paddingBottom: 8,
  },
  saveContainer: {
    backgroundColor: '#fff',
    display: 'block',
    position: 'relative',
    width: '100%',
    zIndex: 20,
    borderRadius: 0,
  },
  saveContainerFixed: {
    position: 'fixed',
    width: 'inherit',
  },
});
