import config from '../../../../../config';

export default theme => ({
  minimizeLink: {
    backgroundColor: theme.palette.disabled.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    '& p': {
      marginLeft: theme.spacing(6),
    },
    '& svg': {
      marginRight: theme.spacing(1.5),
    },
  },
  suggestionArea: {
    position: 'absolute',
    right: theme.spacing(3),
    left: theme.spacing(3),
    zIndex: theme.zIndex.infront,
    backgroundColor: '#fff',
    overflow: 'auto',
    borderRadius: 0,
    borderBottomLeftRadius: theme.spacing(0.5),
    borderBottomRightRadius: theme.spacing(0.5),
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
    borderBottomLeftRadius: theme.spacing(0.5),
    borderBottomRightRadius: theme.spacing(0.5),
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'none',
  },
  infoText: {
    padding: theme.spacing(1),
    marginLeft: theme.spacing(6),
  },
  areaIcon: {
    margin: 0,
  },
});
