
export default theme => ({
  linkText: {
    color: theme.palette.primary.main,
  },
  linkIcon: {
    color: theme.palette.primary.main,
  },
  radioGroup: {
    flexWrap: 'nowrap',
    flexDirection: 'row',
    margin: `${theme.spacing(2)}px 0`,
  },
  urlContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(222, 223, 225, 0.25)',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    margin: `${theme.spacing(1)}px 0`,
    border: '1px solid #DEDFE1',
    width: '100%',
    textAlign: 'left',
    '&:hover': {
      backgroundColor: 'rgba(222, 223, 225, 0.50)',
    },
  },
});
