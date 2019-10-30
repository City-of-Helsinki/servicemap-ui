// TODO: need city (and locale?) parameters to new search fetch

const createSuggestions = async (query, signal) => {
  const results = await fetch(`https://servicemap-api-wip.dev.hel.ninja/servicemap/v2/suggest/?q=${query}`, { signal })
    .then(res => res.json())
    .catch((res) => {
      console.log('error:', res);
      return 'error';
    });
  return results;
};

export default createSuggestions;
