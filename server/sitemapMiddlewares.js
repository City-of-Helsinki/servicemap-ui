import config from '../config';
import { SitemapStream, streamToPromise } from 'sitemap'
import { createGzip } from 'zlib'
import { fetchIDs } from './dataFetcher';

const supportedLanguages = config.supportedLanguages;
let sitemap;

export const initializeSitemap = () => {
  generateSitemap();
};

// This returns sitemaps for different languages
export const getSitemap = (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.header('Content-Encoding', 'gzip');
  
  // Send the cached sitemap
  if (sitemap) {
    res.send(sitemap)
    return
  } else {
    res.status(404).end();
  }
}

const generateSitemap = async () => {
  try {
    const url = config.domain;
    const smStream = new SitemapStream({ hostname: url })
    const pipeline = smStream.pipe(createGzip())

    // Write all page urls that we want to be found by search engines
    const pages = ['home', 'area'];

    pages.forEach(page => (
      smStream.write({ 
        url: `/fi/${page}/`, 
        links: supportedLanguages.map(lang => ({
          lang: lang,
          url: `/${lang}/${page}/`, 
        }))
      })
    ))


    // Generate URLs for all units and servicces
    const unitIDs = await fetchIDs('unit')
    const serviceIDs = await fetchIDs('service')
    
    if (unitIDs?.length) {
      unitIDs.forEach(item => {
        smStream.write({ 
          url: `/fi/unit/${item.id}`, 
          links: supportedLanguages.map(lang => ({
            lang: lang,
            url: `/${lang}/unit/${item.id}`, 
          }))
        })
      });
    }

    if (serviceIDs?.length) {
      serviceIDs.forEach(item => {
        // Do not add services with no units
        if (item?.unit_count?.total !== 0) {
          smStream.write({ 
            url: `/fi/service/${item.id}`, 
            links: supportedLanguages.map(lang => ({
              lang: lang,
              url: `/${lang}/service/${item.id}`, 
            }))
          })
        }
      });
    }

    // Cache the response
    streamToPromise(pipeline).then(sm => sitemap = sm)
    console.log('New sitemap created')
    smStream.end()

  } catch (e) {
    console.error('Failed to create sitemap', e);
  }
}
