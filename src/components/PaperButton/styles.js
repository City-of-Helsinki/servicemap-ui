export default theme => ({
  container: {
    flex: '0 0 auto',
    padding: 0,
    width: '88%',
    maxWidth: 356,
  },
  iconButton: {
    flex: '1 0 auto',
    height: 66,
    padding: 0,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unitDouble,
    justifyContent: 'flex-start',
    textAlign: 'left',
    border: `${theme.palette.detail.alpha} solid 0.5px`,
  },
  iconContainer: {
    display: 'flex',
    flexShrink: 0,
    backgroundColor: theme.palette.primary.main,
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: '50%',
    margin: theme.spacing.unit,
    marginRight: 11,
    marginLeft: 12,
    boxShadow: `0 4px 8px 0 ${theme.palette.detail.alpha}`,
  },
  icon: {
    color: 'inherit',
    height: 'inherit',
    width: 24,
  },
  iconDisabled: {
    backgroundColor: 'rgba(0, 0, 0, 0.26)',
  },
  text: {
    textTransform: 'none',
    lineHeight: '18px',
  },
  textDisabled: {
    color: 'rgba(0, 0, 0, 0.50)',
  },
});
