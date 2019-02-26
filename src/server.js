import express from 'express';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import TestView from './views/TestView';

const app = express();

app.use(express.static(path.resolve(__dirname, 'src')));

const htmlTemplate = reactDom => `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8">
      <title>React SSR</title>
  </head>
  
  <body>
      <div id="app">${reactDom}</div>
      <script src="index.js"></script>
  </body>
  </html>
`;

app.get('/*', (req, res) => {
  const jsx = (<TestView />);
  const reactDom = renderToString(jsx);

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(htmlTemplate(reactDom));
});

app.listen(2048);
