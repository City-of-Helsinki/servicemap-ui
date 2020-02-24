export default theme => ({
  contentArea: {
    paddingLeft: 28,
    paddingRight: 28,
    textAlign: 'left',
  },
  noPadding: {
    padding: 0,
  },
  input: {
    marginTop: 4,
    marginBottom: 4,
    fontSize: 12,
    lineHeight: '20px',
    padding: 10,
    paddingLeft: 14,
    paddingRight: 14,
    width: '100%',
    borderRadius: 2,
    border: '1px solid #000',
    '&:focus': {
      outline: '2px solid transparent',
      boxShadow: `0 0 0 4px ${theme.palette.focusBorder}`,
    },
  },
  inputInfo: {
    display: 'flex',
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    color: `${theme.palette.warning}`,
  },
  errorIcon: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    margin: 0,
  },
  errorField: {
    border: `1px solid ${theme.palette.warning}`,
    boxShadow: `0 0 0 1px ${theme.palette.warning}`,
  },
  characterInfo: {
    color: '#000',
    margin: 0,
    marginLeft: 'auto',
  },
  characterInfoError: {
    color: `${theme.palette.warning}`,
  },
  title: {
    paddingTop: 16,
    paddingBottom: 14,
    paddingRight: 16,
    fontSize: 14,
    fontWeight: 'bold',
  },
  subtitle: {
    paddingLeft: 8,
    fontSize: 12,
  },
  checkbox: {
    display: 'flex',
    paddingTop: 16,
    paddingBottom: 32,
    marginLeft: theme.spacing.unit,
    alignItems: 'center',
    '&:focus': {
      border: '1px solid #1964E6',
    },
  },
  box: {
    marginLeft: -12,
  },
  bottomArea: {
    paddingTop: 8,
    textAlign: 'left',
    borderTop: '1px solid rgba(0,0,0,0.2)',
    paddingLeft: 28,
    paddingRight: 28,
  },
  infoText: {
    marginTop: 14,
  },
  link: {
    marginTop: 14,
    marginBottom: 26,
    textAlign: 'left',
    textDecoration: 'underline',
  },
  modalContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 24,
  },
  modalButton: {
    width: 135,
    color: '#fff',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
