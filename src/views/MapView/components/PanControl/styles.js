export default {
  container: {
    height: 102,
    width: 102,
    '& button': {
      backgroundClip: 'padding-box',
      backgroundColor: '#fff',
      borderRadius: 2,
      border: '2px solid rgba(0,0,0,0.2)',
      color: '#000',
      position: 'absolute',
      width: 34,
      height: 34,
      lineHeight: '30px',
      padding: 0,
    },
  },
  top: {
    right: 34,
  },
  bottom: {
    bottom: 0,
    right: 34,
  },
  right: {
    right: 0,
    top: 34,
  },
  left: {
    left: 0,
    top: 34,
  },
};
