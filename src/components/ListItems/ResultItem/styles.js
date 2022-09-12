
export default theme => ({
  listItemPadded: {
    padding: theme.spacing(2),
  },
  listItem: {
    padding: theme.spacing(1),
  },
  listItemIcon: {
    margin: theme.spacing(1),
    marginRight: theme.spacing(2),
    minWidth: 0,
  },
  listItemIconPadded: {
    margin: theme.spacing(1),
    minWidth: 0,
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
    marginLeft: theme.spacing(2),
  },
  compactTextContainer: {
    width: '100%',
    marginLeft: 0,
    paddingLeft: theme.spacing(1),
    boxSizing: 'border-box',
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
    marginLeft: theme.spacing(1),
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
    marginRight: theme.spacing(-2),
  },
  shortDivider: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(-2),
  },
  compactItem: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
});
