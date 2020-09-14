export default theme => ({
  aTabAdjuster: {
    marginLeft: theme.spacing(1),
  },
  root: {
    height: '100%',
    display: 'flex',
    flexFlow: 'column',
    overflowY: 'auto',
  },
  content: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  bold: {
    fontWeight: 'bold',
  },
  margin: {
    margin: theme.spacing(1),
  },
  label: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
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
    marginRight: theme.spacing(2),
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
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  marginVertical: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  title: {
    display: 'flex',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  subtitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  paragraph: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
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
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
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
  mobileButtonArea: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'end',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  feedbackButton: {
    marginLeft: theme.spacing(2),
  },
  rsButton: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
});
