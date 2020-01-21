import mapBackground from '../../assets/images/front-page-map-bg.png';

export default theme => ({
  background: {
    backgroundImage: `url(${mapBackground})`,
    backgroundSize: 'cover',
    flex: '1 1 auto',
  },
  container: {
    flex: 1,
    padding: 0,
  },
  iconButton: {
    flex: '1 0 auto',
    color: theme.palette.primary.main,
    padding: theme.spacing.unit,
  },
  iconButtonLabel: {
    display: 'flex',
    flexDirection: 'column',
  },
  buttonContainer: {
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  left: {
    textAlign: 'left',
    marginLeft: theme.spacing.unitDouble,
    marginRight: theme.spacing.unitDouble,
    marginTop: 24,
  },
});
