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
  transitBackground: {
    fontFamily: 'hsl-piktoframe',
    position: 'absolute',
    lineHeight: 0,
    zIndex: theme.zIndex.behind,
    color: 'white',
    fontSize: transitIconSize,
  },
  busIcon: {
    fontFamily: 'hsl-piktoframe',
    color: '#007AC9',
    fontSize: transitIconSize,
    lineHeight: 1,
    textShadow: '1px 1px #fff, -1px 1px #fff, 1px -1px #fff, -1px -1px #fff',
  },
  tramIcon: {
    fontFamily: 'hsl-piktoframe',
    color: '#00985F',
    fontSize: transitIconSize,
    lineHeight: 1,
    textShadow: '1px 1px #fff, -1px 1px #fff, 1px -1px #fff, -1px -1px #fff',
  },
  trainIcon: {
    fontFamily: 'hsl-piktoframe',
    color: '#8C4799',
    fontSize: transitIconSize,
    lineHeight: 1,
    textShadow: '1px 1px #fff, -1px 1px #fff, 1px -1px #fff, -1px -1px #fff',
  },
  metroIcon: {
    fontFamily: 'hsl-piktoframe',
    color: '#FF6319',
    fontSize: transitIconSize,
    lineHeight: 1,
    textShadow: '1px 1px #fff, -1px 1px #fff, 1px -1px #fff, -1px -1px #fff',

  },
  ferryIcon: {
    fontFamily: 'hsl-piktoframe',
    color: '#00B9E4',
    fontSize: transitIconSize,
    lineHeight: 1,
    textShadow: '1px 1px #fff, -1px 1px #fff, 1px -1px #fff, -1px -1px #fff',
  },
  userMarker: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:focus': {
      boxShadow: 'none',
    },
  },
  userMarkerForeground: {
    height: '73%',
    width: '73%',
    color: '#fff',
    position: 'absolute',
    paddingBottom: '6%',
  },
  userMarkerBorder: {
    height: '100%',
    width: '100%',
    color: theme.palette.primary.main,
    position: 'absolute',
  },
  userMarkerBackground: {
    position: 'absolute',
    height: '33%',
    width: '33%',
    paddingBottom: '20%',
    backgroundColor: theme.palette.primary.main,
    borderRadius: 50,
  },
  showLocationButton: {
    border: 'none',
    cursor: 'pointer',
    marginRight: '7px !important',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.main,
    width: 40,
    height: 40,
    borderRadius: '50%',
    '&:hover': {
      backgroundColor: theme.palette.secondary.hover,
    },
  },
  locationDisabled: {
    cursor: 'default',
    backgroundColor: '#cccccc',
    '&:hover': {
      backgroundColor: '#cccccc',
    },
    '&:focus': {
      boxShadow: 'none',
    },
  },
  showLocationIcon: {
    color: '#fff',
  },
  topArea: {
    position: 'fixed',
    top: config.topBarHeight,
    width: '100%',
    zIndex: theme.zIndex.infront,
  },
  unitTooltip: {
    padding: theme.spacing.unitDouble,
    textAlign: 'left',
  },
});

export default styles;
