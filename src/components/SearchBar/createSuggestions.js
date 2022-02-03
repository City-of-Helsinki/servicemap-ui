// TODO: need city (and locale?) parameters to new search fetch

const createSuggestions = async (query, signal, locale, getLocaleText) => {
  const fetchSuggestions = url => fetch(url, { signal })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
      return 'error';
    })
    .catch((res) => {
      console.warn('error:', res);
      return 'error';
    });

  const data = await fetchSuggestions(`https://palvelukartta-api-test.agw.arodevtest.hel.fi/search?q=${query}&language=${locale}`); // TODO: use url from .env

  if (data === 'error' || !data.results) {
    return 'error';
  }

  const { addresses } = data.results;

  if (addresses?.length) {
    if (getLocaleText(addresses[0].full_name).toLowerCase() === query.toLowerCase()) {
      addresses[0].isExact = true;
    } else {
      const streetName = getLocaleText(addresses[0].full_name).split(/[\d]/)[0].trim();
      addresses[0].street = streetName;
    }
  }

  return data.results;
};

export default createSuggestions;
