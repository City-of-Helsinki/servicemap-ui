import { transitIconSize } from './config/mapConfig';
import config from '../../../config';

const styles = theme => ({
  map: {
    height: '100%',
    flex: '1 0 auto',
    '& .leaflet-bottom.leaflet-right .leaflet-control button,a': {
      '&:hover': {
        color: '#347865 !important',
      },
      '&:focused': {
        color: '#347865 !important',
      },
    },
  },
  addressLink: {
    color: theme.palette.primary.main,
  },
  loadingScreen: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: theme.zIndex.infront,
  },
  popup: {
    padding: 12,
  },
  addressPopup: {
    lineHeight: '6px',
    width: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    padding: theme.spacing(2),
    position: 'inherit',
    wordBreak: 'break-all',
  },
  addressPopupButton: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(2),
  },
  coordinateLink: {
    color: theme.palette.primary.main,
    wordBreak: 'break-word',
    textAlign: 'left',
    maxWidth: 240,
  },
  areaPopup: {
    padding: theme.spacing(1.5),
    paddingTop: 22,
    paddingBottom: 14,
    display: 'flex',
    flexDirection: 'column',
  },
  areaLink: {
    textAlign: 'center',
    paddingTop: theme.spacing(0.5),
  },
  marginBottom: {
    marginBottom: `${theme.spacing(2)}px !important`,
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
  unitMarker: {
    borderRadius: '50%',
    '&.markerHighlighted': {
      boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.6)',
      '&.dark': {
        boxShadow: '0px 4px 4px 0px rgba(255,255,255,0.8)',
      },
    },
  },
  markerCircle: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '50%',
  },
  bgCircle: {
    backgroundColor: theme.palette.white.main,
    width: 40,
    height: 40,
    '&.markerHighlighted': {
      ...theme.focusIndicator,
    },
  },
  outerCircle: {
    background: 'rgba(0, 22, 183, 0.25)',
    width: 40,
    height: 40,
    '&.dark': {
      background: theme.palette.white.main,
    },
  },
  midCircle: {
    background: 'rgba(0, 22, 183, 0.50)',
    width: 35,
    height: 35,
    '&.dark': {
      background: theme.palette.white.dark,
    },
  },
  innerCircle: {
    fontFamily: 'Lato',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    background: 'rgba(0, 22, 183)',
    width: 30,
    height: 30,
    '&.dark': {
      background: theme.palette.primary.main,
    },
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
  unitTooltipLink: {
    ...theme.typography.body2,
    paddingTop: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.primary.main,
  },
  unitTooltipWrapper: {
    padding: theme.spacing(2),
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
      '&:focus': {
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
  addressIcon: {
    fontSize: 50,
    color: theme.palette.primary.main,
    textShadow: '-1px 0 #fff, 0 1px #fff, 1px 0 #fff, 0 -1px #fff',
    outline: 'none',
  },
  distancePopup: {
    padding: 8,
  },
  distanceMarkerBackground: {
    fontFamily: 'hsl-piktoframe',
    color: '#fff',
    position: 'absolute',
    zIndex: theme.zIndex.behind,
    fontSize: 16,
    top: 16,
    left: 16,
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
    textShadow: '-1px 0 #fff, 0 1px #fff, 1px 0 #fff, 0 -1px #fff',
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
