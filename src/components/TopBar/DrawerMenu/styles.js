import config from '../../../../config';

const { topBarHeight, topBarHeightMobile } = config;

const styles = () => ({
  drawerContainer: {
    color: '#fff',
    top: topBarHeight,
    backgroundColor: '#353638',
    maxWidth: 350,
    padding: 2,
  },
  drawerContainerMobile: {
    color: '#fff',
    top: topBarHeightMobile,
    backgroundColor: '#353638',
    maxWidth: 350,
    padding: 2,
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
  },
  drawerButtonActive: {
    backgroundColor: '#141823',
  },
  drawerButtonText: {
    lineHeight: '18px',
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
