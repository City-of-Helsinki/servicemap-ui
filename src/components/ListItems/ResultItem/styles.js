
export default theme => ({
  singleItem: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  listItemIcon: {
    margin: theme.spacing.unit,
    marginRight: theme.spacing.unitTriple,
  },
  bottomContainer: {
    display: 'inline-block',
    marginTop: '6px',
    '& p': {
      fontWeight: 'normal',
    },
  },
  bottomHighlight: {
    backgroundColor: '#323232',
    color: '#FFF',
    padding: '0 8px',
    marginBottom: '2px',
  },
  cssFocused: {
    outlineStyle: 'solid',
    outlineColor: 'blue',
    outlineWidth: 2,
  },
  title: {
    flex: '1 1 auto',
    textOverflow: 'ellipsis',
    margin: 0,
  },
  noMargin: {
    margin: 0,
  },
  itemTextContainer: {
    flex: '1 1 auto',
    margin: 0,
  },
  itemTextContainerSingle: {
    flex: '1 1 auto',
    margin: 0,
    marginLeft: theme.spacing.unitDouble,
  },
  topRow: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  bottomRow: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  marginLeft: {
    marginLeft: theme.spacing.unit,
  },
  rightColumn: {
    textAlign: 'right',
  },
  caption: {
    color: 'rgba(0,0,0,0.6)',
  },
  text: {
    color: '#000',
    fontWeight: 'normal',
  },
  divider: {
    marginRight: -theme.spacing.unitDouble,
  },
});
