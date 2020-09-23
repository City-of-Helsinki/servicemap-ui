import { transitIconSize } from './config/mapConfig';
import config from '../../../config';

const styles = theme => ({
  map: {
    height: '100%',
    flex: '1 0 auto',
  },
  addressLink: {
    color: theme.palette.primary.main,
  },
  popup: {
    padding: 12,
  },
  addressPopup: {
    lineHeight: '6px',
    padding: 12,
    paddingBottom: 0,
    width: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  addressPopupButton: {
    paddingTop: '9px',
    paddingBottom: 12,
  },
  embedLogo: {
    bottom: 0,
    left: 0,
    height: 'auto',
    position: 'fixed',
    zIndex: 1000,
  },
  userMarker: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  showLocationButton: {
    marginRight: -3,
    backgroundColor: theme.palette.primary.main,
    width: 40,
    height: 40,
    borderRadius: '50%',
    '&:hover': {
      backgroundColor: theme.palette.primary.highContrast,
      '& svg': {
        color: theme.palette.primary.main,
      },
    },
  },
  locationButtonFocus: {
    outline: '2px solid transparent',
    boxShadow: `0 0 0 3px ${theme.palette.primary.highContrast}, 0 0 0 4px ${theme.palette.focusBorder.main}`,
  },
  locationDisabled: {
    backgroundColor: theme.palette.disabled.strong,
  },
  showLocationIcon: {
    color: '#fff',
  },
  measuringCursor: {
    cursor: 'crosshair',
  },
  colorInherit: {
    color: 'inherit',
  },
  topArea: {
    background: theme.palette.background.main,
    color: theme.palette.primary.highContrast,
    position: 'fixed',
    top: config.topBarHeightMobile,
    width: '100%',
    zIndex: theme.zIndex.infront,
  },
  unitTooltip: {
    padding: theme.spacing(2),
    textAlign: 'left',
  },
  unitClusterMarker: {
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.highContrast,
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    fontSize: '18px',
    marginLeft: -20,
    marginTop: -20,
    width: 30,
    height: 30,
    transform: 'translate3d(415px, 460px, 0px)',
    zIndex: 460,
    opacity: 1,
    outline: 'none',
    border: `solid ${theme.palette.primary.main}`,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  unitTooltipContainer: {
    padding: theme.spacing(2),
    textAlign: 'left',
  },
  unitTooltipTitle: {
    ...theme.typography.subtitle1,
    margin: theme.spacing(0.5, 1),
    fontWeight: 'bold',
  },
  unitTooltipSubContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  unitTooltipSubtitle: {
    ...theme.typography.body2,
    margin: theme.spacing(0, 1),
  },
  unitPopupList: {
    listStyleType: 'none',
    padding: 0,
    overflow: 'auto',
    maxHeight: '25vh',
    '& .popup-distance': {
      fontWeight: 'normal',
      fontSize: '14px',
    },
    '& li': {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(1),
      '& p': {
        margin: theme.spacing(0, 1),
      },
      '& hr': {
        height: 1,
        margin: 0,
        border: 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
        paddingTop: 0,
        paddingBottom: 0,
        width: '100%',
      },
      '&:hover': {
        cursor: 'pointer',
        backgroundColor: theme.palette.white.light,
      },
    },
    '& .popup-divider': {
      cursor: 'unset',
      padding: theme.spacing(0, 2),
    },
  },
  unitPopupTitle: {
    ...theme.typography.subtitle1,
    margin: `${theme.spacing(1, 2)} !important`,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  unitPopupItem: {
    ...theme.typography.body2,
    margin: theme.spacing(0.5, 1),
    fontWeight: 'bold',
    wordBreak: 'break-word',
  },
  unitPopupDistance: {
    ...theme.typography.body2,
    margin: theme.spacing(0.5, 1),
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  distanceIcon: {
    fontSize: 50,
    color: theme.palette.primary.main,
    textShadow: '-1px 0 #fff, 0 1px #fff, 1px 0 #fff, 0 -1px #fff',
    outline: 'none',
  },
  distancePopup: {
    padding: 8,
  },
  distanceLine: {
    stroke: theme.palette.primary.main,
  },
  distanceLineBorder: {
    stroke: '#fff',
    strokeWidth: 6,
  },

  // Transit stops
  transitBackground: {
    fontFamily: 'hsl-piktoframe',
    position: 'absolute',
    lineHeight: 0,
    zIndex: theme.zIndex.behind,
    color: 'white',
    fontSize: transitIconSize,
  },
  transitIconMap: {
    fontSize: transitIconSize,
    height: transitIconSize,
    margin: 0,
    lineHeight: 1,
  },
  transitIconInfo: {
    fontSize: 18,
    width: 18,
    height: 18,
    lineHeight: '21px',
    marginLeft: 6,
    marginRight: 4,
  },
  tranistInfoContainer: {
    width: 230,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  transitInfoTitle: {
    fontWeight: 'bold',
    marginBottom: '5%',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    borderBottomColor: 'rgba(0, 0, 0, 0.30)',
    display: 'flex',
    paddingBottom: ' 2%',
  },
  departureItem: {
    marginBottom: 3,
    display: 'flex',
    alignItems: 'center',
  },
  departureTime: {
    width: '15%',
    fontSize: 13,
  },
  departureVehicle: {
    width: '38%',
    display: 'flex',
  },
  vehicleName: {
    display: 'inline',
    fontWeight: 'bold',
  },
  routeName: {
    fontSize: 12,
    width: '55%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  closeButton: {
    marginLeft: 'auto',
  },
  closeText: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
  },
  busIconColor: {
    color: '#007AC9',
  },
  tramIconColor: {
    color: '#00985F',
  },
  trainIconColor: {
    color: '#8C4799',
  },
  metroIconColor: {
    color: '#FF6319',
  },
  ferryIconColor: {
    color: '#00B9E4',
  },
});

export default styles;
