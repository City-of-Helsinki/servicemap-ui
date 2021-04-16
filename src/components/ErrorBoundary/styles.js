import config from '../../../config';
import mapBackground from '../../assets/images/front-page-map-bg.png';

export default theme => ({
  container: {
    display: 'flex',
    width: 'inherit',
  },
  text: {
    justifySelf: 'center',
    alignSelf: 'center',
    margin: 'auto',
  },
  viewContainer: {
    display: 'flex',
    position: 'absolute',
    background: `url(${mapBackground})`,
    backgroundSize: 'cover',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    zIndex: 1000,
  },
  viewBackgroundCover: {
    background: 'linear-gradient(180deg, #FFFFFF 42.74%, rgba(255, 255, 255, 0.0001) 100%)',
    opacity: 0.93,
  },
  viewContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    margin: '84px auto',
    textAlign: 'left',
    padding: theme.spacing(2),
    zIndex: 'inherit',
    '& p': {
      marginBottom: theme.spacing(2),
    },
  },
  viewLogo: {
    height: 60,
    marginBottom: theme.spacing(5),
  },
  viewMobileHeight: {
    top: config.topBarHeightMobile,
  },
});
