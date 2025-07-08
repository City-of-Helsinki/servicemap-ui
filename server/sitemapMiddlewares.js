import { SitemapStream, streamToPromise } from 'sitemap';

import config from '../config';
import { fetchIDs } from './dataFetcher';
import { sitemapActive } from './utils';

const fs = require('fs');
const { createGzip } = require('zlib');

const { supportedLanguages } = config;

// This returns sitemaps for different languages
export const getSitemap = (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.header('Content-Encoding', 'gzip');

  // Send sitemap file
  if (fs.existsSync('/tmp/sitemap.xml')) {
    res.sendFile('/tmp/sitemap.xml');
  } else {
    res.status(404).end();
  }
};

export const getRobotsFile = (req, res, next) => {
  // Returns robots.txt file that points to sitemap location
  if (process.env.DOMAIN) {
    res.type('text/plain');
    if (sitemapActive()) {
      res.send(
        `User-agent: *\nAllow: /\n\nSitemap: ${process.env.DOMAIN}/sitemap.xml`
      );
    } else {
      // Disable crawling if on staging server
      res.send('User-agent: *\nDisallow: /');
    }
  } else {
    next();
  }
};

export const generateSitemap = async () => {
  try {
    const url = process.env.DOMAIN;
    const smStream = new SitemapStream({ hostname: url });
    const pipeline = smStream.pipe(createGzip());

    // Write front page to sitemap
    smStream.write({
      url: '/fi/',
      links: supportedLanguages.map((lang) => ({
        lang,
        url: `/${lang}/`,
      })),
    });

    // Write all page urls that we want to be found by search engines
    const pages = ['area'];

    pages.forEach((page) =>
      smStream.write({
        url: `/fi/${page}/`,
        links: supportedLanguages.map((lang) => ({
          lang,
          url: `/${lang}/${page}/`,
        })),
      })
    );

    // Generate URLs for all units and servicces
    const unitIDs = await fetchIDs('unit');
    const serviceIDs = await fetchIDs('service');

    if (unitIDs?.length) {
      unitIDs.forEach((item) => {
        smStream.write({
          url: `/fi/unit/${item.id}`,
          links: supportedLanguages.map((lang) => ({
            lang,
            url: `/${lang}/unit/${item.id}`,
          })),
        });
      });
    }

    if (serviceIDs?.length) {
      serviceIDs.forEach((item) => {
        // Do not add services with no units
        if (item?.unit_count?.total !== 0) {
          smStream.write({
            url: `/fi/service/${item.id}`,
            links: supportedLanguages.map((lang) => ({
              lang,
              url: `/${lang}/service/${item.id}`,
            })),
          });
        }
      });
    }

    // Save the sitemap as file
    streamToPromise(pipeline).then((sm) => {
      fs.writeFile('/tmp/sitemap.xml', sm, (err) => {
        if (err) return console.log(err);
        return console.log('New sitemap created');
      });
    });
    smStream.end();
  } catch (e) {
    console.error('Failed to create sitemap', e);
  }
};
