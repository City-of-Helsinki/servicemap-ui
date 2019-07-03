

export default theme => ({
  black: {
    color: '#000',
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: '0 0 auto',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  formControl: {
    margin: theme.spacing.unit,
    flex: '1 0 auto',
    flexWrap: 'nowrap',
    textAlign: 'left',
    color: 'inherit',
  },
  selectEmpty: {
    marginTop: theme.spacing.unitDouble,
  },
  select: {
    color: 'inherit',
    '&:before': {
      borderColor: theme.palette.primary.contrastText,
    },
    '&:after': {
      borderColor: theme.palette.primary.contrastText,
    },
  },
  input: {

  },
  icon: {
    color: 'inherit',
  },
});
