export default theme => ({
  container: {
    flex: '0 0 auto',
    padding: 0,
    width: '100%',
    border: `${theme.palette.detail.alpha} solid 0.5px`,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      '& $text': {
        color: theme.palette.primary.highContrast,
      },
      '& $iconContainer': {
        backgroundColor: theme.palette.primary.highContrast,
      },
      '& $icon': {
        color: theme.palette.primary.main,
        '& g': {
          fill: theme.palette.primary.main,
        },
      },
    },
  },
  buttonDisabled: {
    pointerEvents: 'none',
    backgroundColor: theme.palette.disabled.main,
    border: `${theme.palette.disabled.strong} solid 0.5px`,
  },
  iconButton: {
    flex: '1 0 auto',
    minHeight: 66,
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(2),
    justifyContent: 'flex-start',
    textAlign: 'left',
  },
  iconContainer: {
    display: 'flex',
    flexShrink: 0,
    backgroundColor: theme.palette.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: '50%',
    margin: theme.spacing(1, 1.5),
    boxShadow: `0 4px 8px 0 ${theme.palette.detail.alpha}`,
  },
  icon: {
    color: theme.palette.primary.highContrast,
    '& g': {
      fill: theme.palette.primary.highContrast,
    },
  },
  iconDisabled: {
    backgroundColor: theme.palette.disabled.strong,
    boxShadow: `0 4px 8px 0 ${theme.palette.disabled.strong}`,
  },
  text: {
    textTransform: 'none',
    lineHeight: '18px',
    color: 'rgba(0, 0, 0, 0.87)',
  },
  noBorder: {
    margin: 0,
    padding: 0,
    border: 0,
    boxShadow: 'none',
    width: 'auto',
  },
});
