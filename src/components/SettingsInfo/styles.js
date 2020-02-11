import constants from './constants';

export default theme => ({
  container: {
    margin: theme.spacing.unit,
  },
  infoItemContainer: {
    display: 'grid',
    gridTemplateColumns: `repeat(${constants.columns}, 1fr)`,
    margin: `0 0 ${theme.spacing.unitDouble}px 0`,
  },
  infoItem: {
    justifySelf: 'stretch',
    wordBreak: 'break-word',
    position: 'relative',
    padding: `${theme.spacing.unit}px ${theme.spacing.unitDouble}px`,
  },
  infoItemText: {
    fontSize: 11,
    lineHeight: '13px',
  },
  settingsLink: {
    justifyContent: 'left',
  },
  title: {
    fontWeight: 'bold',
    padding: `0 ${theme.spacing.unitDouble}px`,
    textDecoration: 'underline',
    cursor: 'pointer',
    marginBottom: theme.spacing.unitDouble,
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
