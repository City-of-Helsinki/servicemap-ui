

export default theme => ({
  black: {
    color: '#000',
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: '0 0 auto',
    background: theme.palette.background.plain,
    color: theme.palette.primary.highContrast,
    padding: `0 ${theme.spacing.unitTriple}px ${theme.spacing.unitTriple}px ${theme.spacing.unitTriple}px`,
  },
  formControl: {
    display: 'flex',
    flexDirection: 'row',
    flex: '1 0 auto',
    flexWrap: 'nowrap',
    textAlign: 'left',
    color: 'inherit',
    alignItems: 'center',
  },
  selectEmpty: {
    marginTop: 0,
  },
  select: {
    color: 'inherit',
    flex: '1 0 auto',
    fontSize: 12,
    lineHeight: `${15}px`,
    marginTop: 0,
    '&:before': {
      borderColor: theme.palette.primary.highContrast,
    },
    '&:after': {
      borderColor: theme.palette.primary.highContrast,
    },
  },
  inputLabel: {
    color: 'inherit !important',
    flex: '0 1 auto',
    position: 'inherit',
    marginRight: theme.spacing.unitDouble,
  },
  icon: {
    color: 'inherit',
  },
  elementFocus: {
    '&:focus': {
      boxShadow: '0 0 0 3px #fff',
    },
  },
});
