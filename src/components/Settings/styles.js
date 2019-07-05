export default theme => ({
  alert: {
    backgroundColor: '#000',
    color: '#fff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: 0,
    position: 'sticky',
    zIndex: 20,
    borderRadius: 0,
    padding: 0,
    margin: 0,
  },
  alertColor: {
    color: 'rgba(87,186,255, 1)',
  },
  bold: {
    fontWeight: 'bold',
  },
  button: {
    textTransform: 'none',
  },
  buttonActive: {
    backgroundColor: theme.palette.primary.light,
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
    paddingTop: 0,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  confirmationText: {
    textAlign: 'left',
    paddingTop: theme.spacing.unitDouble,
    paddingLeft: theme.spacing.unitDouble,
    paddingRight: theme.spacing.unitDouble,
  },
  contentButton: {
    marginBottom: theme.spacing.unitDouble,
    marginTop: theme.spacing.unitDouble,
  },
  flexBase: {
    flex: '0 0 auto',
  },
  titleContainer: {
    alignItems: 'center',
    display: 'flex',
    flex: '0 0 auto',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0,
  },
  flexReverse: {
    flexDirection: 'row-reverse',
  },
  closeButton: {
    margin: theme.spacing.unit,
    padding: theme.spacing.unitHalf,
  },
  container: {
    backgroundColor: '#fff',
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
  stickyContainer: {
    backgroundColor: '#fff',
    display: 'block',
    top: 0,
    position: 'sticky',
    zIndex: 20,
    borderRadius: 0,
    padding: 0,
    margin: 0,
  },
  stickyMobile: {
    top: 64,
  },
});
