import styles from '../styles';

export default theme => ({
  ...styles(),
  container: {
    color: 'inherit',
    display: 'flex',
    flex: '0 0   auto',
    minHeight: '80px',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    textAlign: 'left',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    borderBottom: '1px solid rgba(255, 255, 255, 0.24)',
    textTransform: 'none',
    justifyContent: 'left',
  },
  textContainer: {
    padding: `${theme.spacing(1)}px 0`,
  },
  link: {
    textDecoration: 'underline',
    '&:hover': {
      color: 'rgba(255, 255, 255, 0.6)',
    },
  }
});
