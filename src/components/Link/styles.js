export default theme => ({
  blue: {
    color: theme.palette.primary.main,
  },
  default: {
    color: 'inherit',
  },
  link: {
    cursor: 'pointer',
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
});
