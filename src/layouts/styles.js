export default theme => ({
  messageText: {
    lineHeight: 'normal',
    whiteSpace: 'pre-wrap',
    '& a': {
      color: '#fff !important',
      textDecoration: 'underline',
      '&:visited': {
        color: '#fff !important',
      },
      '&:hover': {
        color: '#fff !important',
      },
      '&:active': {
        color: '#fff !important',
      },
      '&:focus': {
        color: '#fff !important',
      },
    },
  },
  srFocusedContainer: {
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '0 2px 2px 0',
    boxShadow: '0 2px 2px 0 rgba(0,0,0,.3), 0 0 0 1px rgba(0,0,0,.2)',
    display: 'flex',
    margin: '110px auto 8px 0',
    overflow: 'hidden',
    zIndex: theme.zIndex.infront,
  },
  srFocused: {
    border: `5px solid ${theme.palette.primary.main}`,
    borderRadius: '2px',
    color: '#2228af',
    cursor: 'pointer',
    display: 'inline-block',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '8px 12px',
    minHeight: '32px',
    textDecoration: 'underline',
    textAlign: 'center',
    width: '106px',
    outline: 'none',
    '&:not(:focus)': {
      clip: 'rect(1px,1px,1px,1px)',
      overflow: 'hidden',
      position: 'absolute',
      padding: 0,
    },
  },
});
