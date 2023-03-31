import config from '../../../../config';

const { topBarHeight, topBarHeightMobile } = config;

const styles = theme => ({
  drawerContainer: {
    top: topBarHeight,
    backgroundColor: '#fff',
    width: '100%',
    overflow: 'visible',
    zIndex: theme.zIndex.infront,
  },
  scrollContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: `calc(100vh - ${config.topBarHeight}px - ${config.bottomNavHeight}px)`,
    overflowY: 'auto',
  },
  drawerContainerMobile: {
    top: topBarHeightMobile,
    backgroundColor: '#fff',
    width: '100%',
    overflow: 'visible',
    zIndex: theme.zIndex.behind,
  },
  drawerButton: {
    color: 'inherit',
    height: 80,
    textTransform: 'none',
    justifyContent: 'left',
    textAlign: 'left',
    paddingLeft: 25,
    paddingRight: 25,
    borderBottom: '1px solid rgba(255, 255, 255, 0.24)',
    width: '100%',
  },
  drawerButtonActive: {
    backgroundColor: '#141823',
  },
  drawerButtonText: {
    lineHeight: '1.125rem',
    color: 'inherit',
  },
  drawerIcon: {
    height: 40,
    width: 40,
    borderRadius: '50%',
    backgroundColor: '#6C6C6C',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 25,
    flexShrink: 0,
    '& svg': {
      height: 16,
      width: 16,
    },
    '& g': {
      fill: '#fff',
    },
  },
  drawerIconActive: {
    backgroundColor: '#fff',
    color: '#141823',
  },
  disabled: {
    color: 'rgba(255, 255, 255, 0.55)',
  },
  itemFocus: {
    outline: '2px solid transparent',
    boxShadow: '0 0 0 4px #fff',
  },
});

export default styles;
