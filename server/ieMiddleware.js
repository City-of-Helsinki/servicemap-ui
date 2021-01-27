import { ServerStyleSheets, withStyles } from '@material-ui/styles';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import ThemeWrapper from '../src/themes/ThemeWrapper';

function msieversion(userAgent) {
  var ua = userAgent;
  var msie = ua.indexOf("MSIE ");

  if (msie > -1 || !!ua.match(/Trident.*rv\:11\./))
  {
    return true;
  }

  return false;
}

// IE HTML skeleton
const IEHTML = (reactDom, css, cssString) => `
<!DOCTYPE html>
<html lang="fi">
<head>
  <meta charset="utf-8">
  <title>Palvelukartta</title>
  <style id="jss-server-side">${cssString}</style>
  <style>
    @import url('https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i');
  </style>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#141823" />
</head>

<body>
  <style>${[...css].join('')}</style>
  <div id="app">${reactDom}</div>
</body>
</html>
`;

// Styles for IETemplate
const styles = () => ({
  container: {
    margin: '5%',
    fontFamily: 'Lato',
    fontSize: 14,
    lineHeight: '18px',
  },
  row: {
    backgroundColor: '#ffc233',
    padding: `8px 16px`,
    margin: `24px 0`,
    '& a': {
      display: 'inline-block',
    }
  }
})

// IE Template
const IETemplate = withStyles(styles)(({
  classes
}) => {
  return (
      <div className={classes.container}>
        <div className={classes.row}>
          <p>Palvelukartta-palvelu ei toimi Internet Explorer-selaimella</p>
          <p>Käytä toista selainta, kuten&nbsp;
            <a href="https://www.google.com/intl/fi_fi/chrome/" target="_blank" rel="noopener noreferer">Chrome</a>
            ,&nbsp;
            <a href="https://www.mozilla.org/fi/firefox/new/" target="_blank" rel="noopener noreferer">Firefox</a>
            &nbsp;tai&nbsp;
            <a href="https://www.microsoft/fi-fi/edge/" target="_blank" rel="noopener noreferer">Edge</a>
            &nbsp;ole hyvä
          </p>
        </div>
        <div className={classes.row}>
          <p>Servicekarta tjänsten fungerar inte med Internet Explorer</p>
          <p>Vänligen använd någon annan webbläsare t.ex.&nbsp;
            <a href="https://www.google.com/intl/sv/chrome/" target="_blank" rel="noopener noreferer">Chrome</a>
            ,&nbsp;
            <a href="https://www.mozilla.org/sv-SE/firefox/new/" target="_blank" rel="noopener noreferer">Firefox</a>
            &nbsp;eller&nbsp;
            <a href="https://www.microsoft/sv-se/edge/" target="_blank" rel="noopener noreferer">Edge</a>
          </p>
        </div>
        <div className={classes.row}>
          <p>Servicemap service does not work with Internet Explorer.</p>
          <p>Please use another browser such as&nbsp;
            <a href="https://www.google.com/intl/en_us/chrome/" target="_blank" rel="noopener noreferer">Chrome</a>
            ,&nbsp;
            <a href="https://www.mozilla.org/en-US/firefox/new/" target="_blank" rel="noopener noreferer">Firefox</a>
            &nbsp;or&nbsp;
            <a href="https://www.microsoft/en-us/edge/" target="_blank" rel="noopener noreferer">Edge</a>
          </p>
        </div>
      </div>
  )
});

// Template wrapper
class WrappedTemplate extends React.Component {
  // Remove the server-side injected CSS.
  componentDidMount() {
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
    console.log(jssStyles);
  }

  render() {
    return (
      <ThemeWrapper>
        <IETemplate />
      </ThemeWrapper>
    );
  }
}

// Middleware for handling IE users
// Give custom page for IE users to guide them to download chrome, firefox or edge
const ieHandler = (req, res, next) => {
  try {
    // Check if user-agent is IE
    const ua = req.headers['user-agent'];
    const ie = msieversion(ua);
    if (ie) {
      let store = req._context;
      const css = new Set();
      const insertCss = (...styles) => styles.forEach(style => css.add(style._getCss()));
      // Create server style sheets
      const sheets = new ServerStyleSheets();
      const jsx = sheets.collect(
        <Provider store={store}>
          <StyleContext.Provider value={{ insertCss }}>
            <WrappedTemplate />
          </StyleContext.Provider>
        </Provider>
      );
      const reactDom = ReactDOMServer.renderToString(jsx);
      const cssString = sheets.toString();

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(IEHTML(reactDom, css, cssString));
      return;
    }
  } catch (e) {
    console.log(e);
  }
  
  next();
}

export default ieHandler;
