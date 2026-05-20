import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom/server';

import App from './App';
import ogImage from './assets/images/servicemap-meta-img.png';
import createEmotionCache from './createEmotionCache';
import { setLocale } from './redux/actions/user';

export { ogImage };

export async function render(url, { store, nonce, locale }) {
  if (locale) {
    store.dispatch(setLocale(locale));
  }
  const cache = createEmotionCache(nonce);
  const { extractCriticalToChunks, constructStyleTagsFromChunks } =
    createEmotionServer(cache);
  const helmetContext = {};

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <CacheProvider value={cache}>
        <Provider store={store}>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </Provider>
      </CacheProvider>
    </HelmetProvider>
  );

  const emotionChunks = extractCriticalToChunks(html);
  const emotionCss = constructStyleTagsFromChunks(emotionChunks);
  const { helmet } = helmetContext;

  return { html, helmet, emotionCss };
}
