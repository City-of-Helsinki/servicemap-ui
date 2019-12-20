export default () => ({
  button: {
    marginTop: 24,
    marginBottom: 24,
    paddingLeft: 11,
    paddingRight: 11,
    paddingTop: 7,
    paddingBottom: 7,
    borderRadius: 2,
    border: ' 1px solid rgba(0, 0, 0, 0.5)',
    '&:active': {
      backgroundColor: '#4C4D4F',
      color: '#fff',
    },
  },
  buttonIcon: {
    color: 'inherit',
    paddingRight: 8,
  },
  buttonText: {
    color: 'inherit',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabled: {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    color: 'rgba(0, 0, 0, 0.26)',
  },
});
