import express from 'express';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from '../App';
import Template from '../views/Template';

const app = express();

app.use('/static', express.static(path.resolve(__dirname, 'src')));

app.get('/', (req, res) => {
  const component = ReactDOMServer.renderToString(<Template />);

  const html = `
    <!doctype html>
      <html>
        <head>
          
        </head>
      <body>
        <div id="root">${component}</div>
        <script src="/static/home.js"></script>
      </body>
    </html>`;

  res.send(html);
});

app.listen(3000);
