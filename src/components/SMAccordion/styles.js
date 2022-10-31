export default theme => ({
  accordionContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  accordion: {
    alignSelf: 'center',
    height: theme.spacing(7),
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    alignItems: 'center',
  },
  icon: {
    fontSize: '1.5rem',
    transition: '0.3s',
    marginLeft: 'auto',
    color: theme.palette.primary.main,
  },
  iconOpen: {
    transform: 'rotate(180deg)',
  },
  iconDisabled: {
    color: theme.palette.disabled.strong,
  },
  clickArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'left',
    textAlign: 'start',
    wordBreak: 'break-word',
  },
  collapseContainer: {
    width: '100%',
  },
  elevated: {
    boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.06)',
    position: 'relative',
  },
});
