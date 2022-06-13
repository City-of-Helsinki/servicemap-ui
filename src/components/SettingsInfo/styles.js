import constants from './constants';

export default theme => ({
  container: {
    margin: theme.spacing(1),
  },
  infoItemContainer: {
    display: 'grid',
    gridTemplateColumns: `repeat(${constants.columns}, 1fr)`,
    margin: theme.spacing(0, 0, 2, 0),
  },
  infoItem: {
    justifySelf: 'stretch',
    wordBreak: 'break-word',
    position: 'relative',
    padding: theme.spacing(1, 2),
  },
  infoItemText: {
    fontSize: '0.688rem',
    lineHeight: '0.813rem',
  },
  settingsLink: {
    justifyContent: 'left',
  },
  title: {
    fontWeight: 'bold',
    padding: theme.spacing(0, 2),
    textDecoration: 'underline',
    cursor: 'pointer',
    marginBottom: theme.spacing(2),
    '&:hover': {
      opacity: '0.7',
    },
  },
  verticalDivider: {
    backgroundColor: theme.palette.primary.main,
    height: 20,
    width: 1,
    position: 'absolute',
    right: 0,
    top: 'calc(50% - 10px)',
  },
});
