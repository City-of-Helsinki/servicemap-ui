// TODO: need city (and locale?) parameters to new search fetch

const createSuggestions = async (query, signal) => {
  const data = await Promise.all([
    fetch(`https://servicemap-api-wip.dev.hel.ninja/servicemap/v2/suggest/?q=${query}`, { signal })
      .then(res => res.json())
      .catch((res) => {
        console.log('error:', res);
        return 'error';
      }),
    fetch(`https://api.hel.fi/servicemap/v2/search/?input=${query}&language=fi&page=1&page_size=3&type=address`, { signal })
      .then(res => res.json())
      .catch((res) => {
        console.log('error:', res);
        return 'error';
      }),
  ]);

  if (data[0] === 'error' && data[1] === 'error') {
    return 'error';
  }

  let suggestions = [];
  // Handle address fetch results
  if (data[1] !== 'error' && data[1].results.length) {
    suggestions = [...data[1].results];
  }
  // Handle suggestion API results
  if (data[0] !== 'error' && data[0].suggestions.length) {
    data[0].suggestions.forEach((element) => {
      if (!element.object_type) {
        // eslint-disable-next-line no-param-reassign
        element.object_type = 'suggestion';
      }
    });
    suggestions = [...suggestions, ...data[0].suggestions];
  }
  return suggestions;
};

export default createSuggestions;
