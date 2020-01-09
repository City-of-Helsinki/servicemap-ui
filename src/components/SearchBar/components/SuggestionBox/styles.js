import config from '../../../../../config';

export default theme => ({
  suggestionArea: {
    position: 'absolute',
    right: theme.spacing.unitTriple,
    left: theme.spacing.unitTriple,
    zIndex: theme.zIndex.infront,
    backgroundColor: '#fff',
    overflow: 'auto',
    borderRadius: 0,
    borderBottomLeftRadius: theme.spacing.unitHalf,
    borderBottomRightRadius: theme.spacing.unitHalf,
    maxHeight: `calc(80vh - ${config.topBarHeight}px)`,
  },
  suggestionAreaMobile: {
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: theme.zIndex.infront,
    backgroundColor: '#fff',
    overflow: 'auto',
    borderRadius: 0,
    borderBottomLeftRadius: theme.spacing.unitHalf,
    borderBottomRightRadius: theme.spacing.unitHalf,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'none',
  },
  infoText: {
    padding: theme.spacing.unit,
    marginLeft: theme.spacing.unitTriple * 2,
  },
});
