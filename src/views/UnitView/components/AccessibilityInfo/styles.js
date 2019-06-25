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
  noShortcomingsIcon: {
    color: config.accessibility_colors.default,
  },
  title: {
    marginBottom: theme.spacing.unitDouble,
  },
});
