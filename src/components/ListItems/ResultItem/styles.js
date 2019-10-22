
export default theme => ({
  cssFocused: {
    outlineStyle: 'solid',
    outlineColor: 'blue',
    outlineWidth: 2,
  },
  title: {
    flex: '1 1 auto',
    textOverflow: 'ellipsis',
    margin: 0,
    marginBottom: theme.spacing.unit,
  },
  secondaryContent: {
    marginRight: 8,
    textAlign: 'right',
  },
  noMargin: {
    margin: 0,
  },
  itemTextContainer: {
    flex: '1 1 auto',
    marginLeft: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
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
  bottomColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  caption: {
    color: 'rgba(0,0,0,0.6)',
  },
  compact: {
    height: 20,
  },
});
