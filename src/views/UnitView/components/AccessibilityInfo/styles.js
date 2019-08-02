import config from '../../../../../config';

export default theme => ({
  colorLight: {
    color: theme.custom.body2light.color,
  },
  listIcon: {
    alignSelf: 'flex-start',
    color: theme.palette.warning,
  },
  listItem: {
    paddingLeft: theme.spacing.unit,
  },
  list: {
    paddingLeft: theme.spacing.unit * 3,
  },
  noInfoColor: {
    color: config.accessibilityColors.missingInfo,
  },
  noShortcomingsColor: {
    color: config.accessibilityColors.default,
  },
  title: {
    marginBottom: theme.spacing.unitDouble,
  },
});
