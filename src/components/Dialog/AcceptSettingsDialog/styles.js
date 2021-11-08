export default theme => ({
  radioGroup: {
    flexWrap: 'nowrap',
    flexDirection: 'row',
    margin: `${theme.spacing(2)}px 0`,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
    radioGroupItem: {
      [theme.breakpoints.down('sm')]: {
        margin: `${theme.spacing(1)}px 0`,
      },
    },
  },
  opnButton: {
    marginRight: 0,
  },
});
