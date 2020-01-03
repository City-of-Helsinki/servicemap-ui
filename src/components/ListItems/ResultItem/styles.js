
export default theme => ({
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
