import express from 'express';
// import fs from 'fs';
import React from 'react';
import Helmet from 'react-helmet';
import { StaticRouter } from 'react-router';
import ReactDOMServer from 'react-dom/server';
import path from 'path';
import App from '../src/App';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.resolve(__dirname, '../build')));

app.get('*', (req, res) => {
  const component = ReactDOMServer.renderToString(<StaticRouter location={req.url}><App /></StaticRouter>);
  const helmet = Helmet.renderStatic();

  const html = `
    <!doctype html>
      <html>
        <head>
          ${helmet.title.toString()}
          ${helmet.meta.toString()}
          ${helmet.link.toString()}
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
          <div id="root">${component}</div>
        </body>
      </html>`;
  res.send(html);
});

app.listen(PORT);
