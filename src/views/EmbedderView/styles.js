import config from '../../../config';

export default (theme) => {
  const { topBarHeight } = config;
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
      width: 'fit-content',
      alignSelf: 'flex-end',
      margin: 0,
      marginTop: 'auto',
      marginBottom: theme.spacing(2),
    },
    checkbox: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    closeButton: {
      marginLeft: 'auto',
    },
    container: {
      display: 'inline-flex',
      flexDirection: 'column',
      margin: 0,
      height: `calc(100vh - ${topBarHeight}px)`,
    },
    iframeContainer: {
      width: '100%',
    },
    iframeWrapper: {
      border: '3px dashed #666',
    },
    formContainer: {
      margin: `${theme.spacing(2)}px 0`,
      marginTop: 0,
      width: '45%',
      height: '100%',
      overflowY: 'auto',
      paddingLeft: '9.5vw',
      paddingRight: theme.spacing(3),
    },
    previewContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: '55%',
      height: '100%',
      overflowY: 'auto',
      marginLeft: theme.spacing(3),
      marginRight: '6.5vw',
      paddingRight: theme.spacing(2),
    },
    marginBottom: {
      marginBottom: theme.spacing(2),
    },
    formContainerPaper: {
      width: '100%',
      boxSizing: 'border-box',
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
      height: 60,
      fontSize: 14.6,
      borderRadius: '8px',
    },
    htmlField: {
      backgroundColor: '#f2f2f2',
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      wordWrap: 'break-word',
    },
    copyButton: {
      margin: 0,
      height: 60,
      marginRight: -14,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      textTransform: 'uppercase',
      flexDirection: 'row-reverse',
      borderRadius: '8px',
    },
    copyIcon: {
      fontSize: 16,
      paddingLeft: theme.spacing(1),
    },
    title: {
      ...theme.typography.h4,
      width: '100%',
    },
    titleContainer: {
      margin: `${theme.spacing(2)}px 0`,
      paddingTop: 0,
      paddingLeft: '9.5vw',
      paddingRight: '9.5vw',
      paddingBottom: theme.spacing(3),
      position: 'relative',
      display: 'flex',
      flexWrap: 'wrap',
    },
    scrollContainer: {
      display: 'flex',
      flexDirection: 'row',
      overflow: 'hidden',
    },
    mapControlContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    infoText: {
      whiteSpace: 'pre-line',
      lineHeight: '1.5rem',
    },
    infoTitle: {
      lineHeight: '2rem',
    },
    divider: {
      width: 4,
    },
  };
};
