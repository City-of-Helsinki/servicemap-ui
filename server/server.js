/* eslint-disable no-underscore-dangle */
import express from 'express';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import thunk from 'redux-thunk';
import config from '../config';
import rootReducer from '../src/rootReducer';
import App from '../src/App';
import {makeLanguageHandler, makeUnitHandler} from './utils';
import { unitsFetchDataSuccess } from '../src/redux/actions/unit';
import { setSelectedFilter } from '../src/redux/actions/filter';

// Configure constants
const app = express();
const serverConfig = config.server;
const languages = config.supported_languages.join('|');
const baseURL = `${serverConfig.url_prefix}(:lang(${languages})?)`;


// Add static folder
app.use(express.static(path.resolve(__dirname, 'src')));

// Add middlewares
app.get(`/*`, makeLanguageHandler);
app.use(`${baseURL}/unit`, makeUnitHandler);

app.get('/*', (req, res, next) => {
  // CSS for all rendered React components
  const css = new Set(); 
  const insertCss = (...styles) => styles.forEach(style => css.add(style._getCss()));
  const store = createStore(rootReducer, applyMiddleware(thunk));

  // Dispatch unit data to redux
  if (req._context) {
    store.dispatch(setSelectedFilter(req._context.id))
    store.dispatch(unitsFetchDataSuccess([req._context]));
  }
  const jsx = (
    <Provider store={store}>
      <StaticRouter location={req.url} context={{}}>
        <StyleContext.Provider value={{ insertCss }}>
          <App />
        </StyleContext.Provider>
      </StaticRouter>
    </Provider>
  );
  const reactDom = renderToString(jsx);

  const preloadedState = store.getState();

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(htmlTemplate(reactDom, preloadedState, css));
});

console.log(`Starting server on port ${serverConfig.port || 2048}`);
app.listen(serverConfig.port || 2048);


const htmlTemplate = (reactDom, preloadedState, css) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>React SSR</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.4.0/dist/leaflet.css"
    integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
    crossorigin=""
      />
    <script 
      src="https://unpkg.com/leaflet@1.4.0/dist/leaflet.js"
      integrity="sha512-QVftwZFqvtRNi0ZyCtsznlKSWOStnDORoefr1enyq5mVL4tmKB3S/EnC3rRJcxCPavG10IcrVGSmPh6Qw5lwrg=="
      crossorigin="">
    </script>
  </head>

  <body>
    <div id="app">${reactDom}</div>
    <style>${[...css].join('')}</style>
    <script>
      // WARNING: See the following for security issues around embedding JSON in HTML:
      // http://redux.js.org/recipes/ServerRendering.html#security-considerations
      window.PRELOADED_STATE = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
    </script>
    <script src="/index.js"></script>
  </body>
</html>
`;