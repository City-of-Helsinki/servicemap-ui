import config from '../config';
import { SitemapStream, SitemapIndexStream, streamToPromise } from 'sitemap'
import { createGzip } from 'zlib'
import { fetchAllUnitIDs } from './dataFetcher';

const supportedLanguages = config.supportedLanguages;
let sitemapIndex;
const sitemaps = {}

export const initializeSitemaps = () => {
  // Create sitemap index and sitemaps for each language
  generateSitemapIndex()
  supportedLanguages.forEach(lang => {
    generateSitemap(lang);
  })
}

// Return sitemap index
export const getSitemapIndex = (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.header('Content-Encoding', 'gzip');
 
  if (sitemapIndex) {
    res.send(sitemapIndex)
    return
  } else {
    res.status(404).end();
  }  
}

// This returns sitemaps for different languages
export const getSitemap = (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.header('Content-Encoding', 'gzip');
  
  const locale = req.params.lang;

  if (!supportedLanguages.includes(locale)) {
    res.status(404).end();
  }
  // Send the cached sitemap
  if (sitemaps[locale]) {
    res.send(sitemaps[locale])
    return
  } else {
    res.status(404).end();
  }
}

const generateSitemapIndex = () => {
  try {
    const url = config.domain;
    const smis = new SitemapIndexStream()
    const pipeline = smis.pipe(createGzip())

    // Create links to each language sitemap
    supportedLanguages.forEach(lang => {
      smis.write({ url: `${url}/${lang}/sitemap.xml` })
    })

    // Cache the response
    streamToPromise(pipeline).then(smi => sitemapIndex = smi)
    smis.end()

  } catch (e) {
    console.error(e)
  }
}

const generateSitemap = async (locale) => {
  try {
    const url = config.domain;
    const smStream = new SitemapStream({ hostname: url })
    const pipeline = smStream.pipe(createGzip())

    // Write all page urls that we want to be found by search engines
    smStream.write({ url: `/${locale}/home/` })
    smStream.write({ url: `/${locale}/area/` })
    // smStream.write({ url: `/${lang}/services/` })

    // Generate URLs for all units
    const unitIDs = await fetchAllUnitIDs()
    if (unitIDs?.length) {
      unitIDs.forEach(item => {
        smStream.write({ url: `/${locale}/unit/${item.id}` })
      });
    }
    
    // Cache the response
    streamToPromise(pipeline).then(sm => sitemaps[locale] = sm)
    smStream.end()

  } catch (e) {
    console.error('Failed to create sitemap', e);
  }
}
