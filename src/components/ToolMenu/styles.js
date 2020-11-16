import config from '../../../config';

const menuContainerTop = config.topBarHeight + 1;

export default ({
  menuContainer: {
    position: 'fixed',
    backgroundColor: '#fff',
    right: 1,
    padding: 0,
    margin: 0,
    top: menuContainerTop,
    border: '1px solid blue',
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
  smIcon: {
    margin: '0px !important',
    width: '24px !important',
    height: '24px !important',
  },
  measuringButton: {
    position: 'absolute',
    right: 0,
    top: 86,
    borderRadius: 4,
    border: '2px solid #fff',
  },
});
