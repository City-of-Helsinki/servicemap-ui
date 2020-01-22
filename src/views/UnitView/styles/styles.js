export default theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexFlow: 'column',
    overflowY: 'auto',
  },
  content: {
    paddingLeft: theme.spacing.unitDouble,
    paddingRight: theme.spacing.unitDouble,
    paddingBottom: theme.spacing.unitDouble,
  },
  bold: {
    fontWeight: 'bold',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  label: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  cssFocused: {
    outlineStyle: 'solid',
    outlineColor: 'blue',
    outlineWidth: 2,
  },
  input: {
    marginLeft: 8,
    flex: 1,
    padding: 10,
  },
  iconButton: {
    padding: 10,
  },
  icon: {
    fontSize: 24,
    margin: 0,
  },
  eventIcon: {
    marginRight: theme.spacing.unitDouble,
  },
  borderBottom: {
    borderBottom: '1px solid rgba(0,0,0,0.2)',
  },
  link: {
    color: '#0000EE',
    textDecoration: 'underline',
  },
  left: {
    textAlign: 'left',
    marginLeft: theme.spacing.unitDouble,
    marginRight: theme.spacing.unitDouble,
  },
  marginVertical: {
    marginTop: theme.spacing.unitDouble,
    marginBottom: theme.spacing.unitDouble,
  },
  title: {
    display: 'flex',
    marginTop: theme.spacing.unitDouble,
    marginBottom: theme.spacing.unitDouble,
  },
  subtitle: {
    marginTop: theme.spacing.unitDouble,
    marginBottom: theme.spacing.unitDouble,
  },
  paragraph: {
    marginTop: theme.spacing.unitDouble,
    marginBottom: theme.spacing.unitDouble,
    whiteSpace: 'pre-line',
  },
  divider: {
    marginRight: 0,
  },
  image: {
    objectFit: 'cover',
    height: '100%',
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  imageCaption: {
    width: '100%',
    minHeight: 31,
    fontSize: 12,
    lineHeight: '15px',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing.unit,
    paddingLeft: theme.spacing.unitDouble,
    paddingRight: theme.spacing.unitDouble,
    bottom: 0,
    left: 0,
    color: '#000',
    backgroundColor: '#F0F0F0',
    boxSizing: 'border-box',
    textAlign: 'left',
  },
  fullListContent: {
    height: '100%',
    overflow: 'auto',
  },
  topArea: {
    backgroundColor: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: theme.zIndex.sticky,
  },
  mobileButtonArea: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'end',
    paddingLeft: theme.spacing.unitDouble,
    paddingRight: theme.spacing.unitDouble,
    marginBottom: theme.spacing.unit,
  },

});
