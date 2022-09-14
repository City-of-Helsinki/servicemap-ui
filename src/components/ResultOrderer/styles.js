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
    padding: theme.spacing(0, 3, 3, 3),
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
    fontSize: '0.75rem',
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
    marginRight: theme.spacing(2),
  },
  icon: {
    color: 'inherit',
  },
  selectElement: {
    padding: theme.spacing(1.5),
    '&:focus': {
      boxShadow: '0 0 0 3px #fff',
    },
  },
});
