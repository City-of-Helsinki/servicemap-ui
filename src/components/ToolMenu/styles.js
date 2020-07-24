import config from '../../../config';

export default ({
  menuContainer: {
    position: 'fixed',
    backgroundColor: '#fff',
    right: 0,
    padding: 0,
    margin: 0,
    top: config.topBarHeight,
  },
  menuContainerDrawer: {
    backgroundColor: 'inherit',
    position: 'relative',
    margin: 0,
    padding: 0,
  },
  fullWidth: {
    width: '100%',
  },
  menuButton: {
    marginLeft: 'auto',
    justifySelf: 'flex-end',
  },
});
