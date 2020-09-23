export default (theme) => {
  const formPaperHorizontalPadding = theme.spacing(3);
  return {
    appBar: {
      position: 'relative',
      padding: theme.spacing(2),
      backgroundColor: theme.palette.primary.main,
      top: 0,
      left: 'auto',
      right: 0,
    },
    button: {
      float: 'right',
      margin: 0,
      marginBottom: theme.spacing(2),
    },
    checkbox: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    closeButton: {
      position: 'absolute',
      top: 0,
      right: 0,
    },
    container: {
      margin: `0 10% ${theme.spacing(3)}px 10%`,
    },
    iframeContainer: {
      width: '100%',
    },
    iframeWrapper: {
      border: '3px dashed #666',
    },
    formContainer: {
      margin: `${theme.spacing(2)}px 0`,
    },
    marginBottom: {
      marginBottom: theme.spacing(2),
    },
    formContainerPaper: {
      minWidth: `calc(100% - ${formPaperHorizontalPadding * 2}px)`,
      display: 'inline-block',
      margin: `${theme.spacing(3)}px 0`,
      padding: `${theme.spacing(2)}px ${formPaperHorizontalPadding}px`,
      textAlign: 'left',
      '& label': {
        margin: `${theme.spacing(1)}px 0`,
      },
      '& fieldset': {
        margin: '0 -12px',
      },
    },
    pre: {
      backgroundColor: '#f2f2f2',
      border: '1px solid #ccc',
      borderRadius: 2,
      color: '#191919',
      display: 'block',
      fontSize: 14,
      lineHeight: 1.42857143,
      margin: '0 0 10.5px',
      padding: 10,
      textAlign: 'left',
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      wordWrap: 'break-word',
    },
    pusher: {
      flex: '0 0 auto',
      width: 64,
    },
    textField: {
      width: '100%',
    },
    title: {
      ...theme.typography.h4,
      marginBottom: theme.spacing(3),
    },
    titleContainer: {
      margin: `${theme.spacing(2)}px 0`,
      padding: theme.spacing(3),
      position: 'relative',
    },
  };
};
