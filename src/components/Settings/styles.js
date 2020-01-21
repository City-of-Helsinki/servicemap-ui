import config from '../../../config';

const { topBarHeight } = config;

export default theme => ({
  alert: {
    backgroundColor: '#353638',
    color: '#fff',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 57,
    top: 0,
    position: 'sticky',
    zIndex: theme.zIndex.forward,
    borderRadius: 0,
    padding: 0,
    paddingLeft: 46,
    paddingRight: theme.spacing.unitDouble,
    margin: 0,
  },
  alertText: {
    fontWeight: 'bold',
  },
  button: {
    textTransform: 'none',
    fontSize: 12,
  },
  buttonLabel: {
    display: 'flex',
    flexDirection: 'column',
  },
  checkbox: {
    padding: theme.spacing.unit,
  },
  confirmationButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: '16px 0px 16px 46px',
  },
  confirmationButton: {
    height: 32,
    minWidth: 52,
    marginRight: 16,
    padding: 8,
  },
  primary: {
    color: '#fff',
    backgroundColor: theme.palette.primary.main,
  },
  secondary: {
    color: '#000',
    border: '1px solid',
  },
  contentButton: {
    marginBottom: theme.spacing.unitDouble,
    marginTop: theme.spacing.unitDouble,
  },
  flexBase: {
    flex: '0 0 auto',
  },
  formContainer: {
    paddingLeft: 38,
  },
  titleContainer: {
    alignItems: 'center',
    display: 'flex',
    flex: '0 0 auto',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 0,
    margin: `0 ${theme.spacing.unit}px`,
  },
  titleText: {
    margin: `${theme.spacing.unit}px 0`,
  },
  flexReverse: {
    flexDirection: 'row-reverse',
  },
  closeButton: {
    margin: `0 ${theme.spacing.unit}px`,
    padding: theme.spacing.unitHalf,
  },
  container: {
    backgroundColor: '#fff',
  },
  hidden: {
    display: 'none',
  },
  icon: {
    marginLeft: 20,
    marginRight: 32,
    display: 'inline-block',
    verticalAlign: 'middle',
    height: 24,
    width: 24,
  },
  list: {
    paddingTop: 0,
  },
  noMargin: {
    margin: 0,
  },
  pageTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    height: 57,
    paddingLeft: 46,
    background: theme.palette.background.main,
  },
  pageTitleText: {
    fontSize: 18,
    color: '#fff',
  },
  radioGroup: {
    padding: 0,
    margin: 0,
  },
  radioLabel: {
    margin: 0,
    marginLeft: `-${theme.spacing.unitHalf}px`,
    padding: `${theme.spacing.unit}px 0`,
  },
  stickyContainer: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 57,
    paddingLeft: 46,
    top: 0,
    position: 'sticky',
    zIndex: theme.zIndex.sticky,
    borderRadius: 0,
    padding: 0,
    margin: 0,
  },
  stickyMobile: {
    top: topBarHeight,
  },
  disabled: {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    color: 'rgba(0, 0, 0, 0.26)',
  },
  right: {
    marginLeft: 'auto',
  },
});
