export default theme => ({
  title: {
    color: 'inherit',
    lineHeight: 1,
  },
  titleSmall: {
    ...theme.typography.caption,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: 'normal',
  },
  text: {
    color: 'inherit',
    margin: 0,
    textAlign: 'left',
    overflow: 'hidden',
    width: '100%',
    textOverflow: 'ellipsis',
  },
  textSmall: {
    ...theme.typography.caption,
    lineHeight: '18px',
    color: 'inherit',
  },
  titlePlain: {
    fontWeight: 'bold',
    lineHeight: '24px',
    textAlign: 'left',
    fontSize: '0.875rem',
  },
  textPlain: {
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    textAlign: 'left',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineClamp: 2,
  },
  smallIcon: {
    height: 14,
    marginRight: 4,
  },
});
