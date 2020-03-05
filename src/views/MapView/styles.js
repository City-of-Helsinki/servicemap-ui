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
    padding: theme.spacing.unitDouble,
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
    padding: theme.spacing.unitDouble,
    textAlign: 'left',
  },
  unitTooltipTitle: {
    ...theme.typography.subtitle1,
    margin: `${theme.spacing.unitHalf}px ${theme.spacing.unit}px`,
    fontWeight: 'bold',
  },
  unitTooltipSubContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  unitTooltipSubtitle: {
    ...theme.typography.body2,
    margin: `0 ${theme.spacing.unit}px`,
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
      padding: `${theme.spacing.unit}px ${theme.spacing.unit}px`,
      '& p': {
        margin: `0 ${theme.spacing.unit}px`,
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
      padding: `0 ${theme.spacing.unitDouble}px`,
    },
  },
  unitPopupTitle: {
    ...theme.typography.subtitle1,
    margin: `${theme.spacing.unit}px ${theme.spacing.unitDouble}px !important`,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  unitPopupItem: {
    ...theme.typography.body2,
    margin: `${theme.spacing.unitHalf}px ${theme.spacing.unit}px`,
    fontWeight: 'bold',
    wordBreak: 'break-word',
  },
  unitPopupDistance: {
    ...theme.typography.body2,
    margin: `${theme.spacing.unitHalf}px ${theme.spacing.unit}px`,
    fontWeight: 'bold',
  },
});

export default styles;
