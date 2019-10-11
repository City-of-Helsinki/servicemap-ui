import { transitIconSize } from './config/mapConfig';

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
    zIndex: -1,
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
  unitTooltip: {
    padding: theme.spacing.unitDouble,
    textAlign: 'left',
  },
});

export default styles;
