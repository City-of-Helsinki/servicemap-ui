export default {
  container: {
    height: 90,
    width: 90,
    '& button': {
      backgroundClip: 'padding-box',
      backgroundColor: '#f4f4f4',
      border: '2px solid rgba(0,0,0,0.2)',
      color: '#000',
      position: 'absolute',
      width: 30,
      height: 30,
      lineHeight: '30px',
      padding: 0,
      '&:hover': {
        color: 'red',
      },
      '&:focused': {
        color: 'red',
      },
    },
  },
  top: {
    right: 30,
  },
  bottom: {
    bottom: 0,
    right: 30,
  },
  right: {
    right: 0,
    top: 30,
  },
  left: {
    left: 0,
    top: 30,
  },
};
