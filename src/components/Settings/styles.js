export default theme => ({
  button: {
    textTransform: 'none',
  },
  buttonLabel: {
    display: 'flex',
    flexDirection: 'column',
  },
  confirmationButton: {
    flex: '0 0 auto',
  },
  confirmationButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    margin: 0,
  },
  confirmationText: {
    textAlign: 'left',
    padding: theme.spacing.unitDouble,
  },
  contentButton: {
    marginBottom: theme.spacing.unitDouble,
    marginTop: theme.spacing.unitDouble,
  },
  titleContainer: {
    alignItems: 'center',
    display: 'flex',
    flex: '0 0 auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0,
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
  list: {
    paddingTop: 0,
  },
  noMargin: {
    margin: 0,
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
    padding: 0,
    margin: 0,
  },
  saveContainerFixed: {
    position: 'fixed',
    width: 'inherit',
  },
});
