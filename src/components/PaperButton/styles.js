export default theme => ({
  container: {
    flex: 1,
    padding: 0,
    width: '88%',
    maxWidth: 356,
  },
  iconButton: {
    flex: '1 0 auto',
    padding: theme.spacing.unit,
    paddingRight: theme.spacing.unitDouble,
    justifyContent: 'left',
    textAlign: 'left',
    border: 'rgba(25,100,230,0.50) solid 0.5px',
  },
  iconContainer: {
    display: 'flex',
    flexShrink: 0,
    backgroundColor: '#1964E6',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: '50%',
    margin: theme.spacing.unit,
    marginRight: 11,
    marginLeft: 12,
    boxShadow: '0 4px 8px 0 rgba(59,72,238,0.3)',
  },
  icon: {
    color: 'inherit',
  },
  iconButtonDisabled: {
    color: 'inherit',
  },
  text: {
    textTransform: 'none',
    lineHeight: '18px',
  },
});
