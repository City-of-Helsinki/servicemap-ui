export default () => ({
  accordionContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  accordion: {
    alignSelf: 'center',
    height: 60,
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
    paddingLeft: 12,
    paddingRight: 16,
    alignItems: 'center',
  },
  icon: {
    fontSize: 30,
    transition: '0.3s',
    marginLeft: 'auto',
  },
  iconOpen: {
    transform: 'rotate(180deg)',
  },
  clickArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'left',
    textAlign: 'start',
  },
  collapseContainer: {
    width: '100%',
  },
});
