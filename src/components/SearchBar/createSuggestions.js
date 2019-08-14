import { uppercaseFirst } from '../../utils';
import expandSearch from './expandSearch';

const pageSize = 50;
const listLength = 10;

const createSuggestions = async (query, getLocaleText, signal) => {
  let results = [];
  await fetch(`https://api.hel.fi/servicemap/v2/search/?input=${query}&only=unit.name&page_size=${pageSize}&type=unit,service`, {
    signal,
  })
    .then(response => response.json())
    .then((data) => {
      const resultData = data;
      const suggestions = [];
      // Form a list of suggestions from query results
      for (let i = 0; suggestions.length < listLength && i < pageSize && i < resultData.count; i += 1) {
        if (resultData.results[i].object_type === 'service') {
          suggestions.push(getLocaleText(resultData.results[i].name));
        } else {
          // Split result name strings words
          const words = getLocaleText(resultData.results[i].name).split(' ');
          let resultWord = null;
          // Find the word from result name that matches the original query
          words.forEach((word) => {
            if (uppercaseFirst(word).indexOf(uppercaseFirst(query)) !== -1) {
              resultWord = uppercaseFirst(word);
              // TODO: better check
              if (!resultWord.slice(-1).match(/[a-z]/i)) {
                resultWord = resultWord.slice(0, -1);
              }
            }
          });
          // Add the word to list of suggestions if it is not there already
          if (suggestions.indexOf(resultWord) === -1) {
            suggestions.push(resultWord);
          }
        }
      }
      return suggestions;
    })
    .then(async (suggestions) => {
      const searchData = [];
      // Fetch the result count of each suggestion
      const data = await Promise.all(suggestions.map(word => fetch(`https://api.hel.fi/servicemap/v2/search/?q=${word}&only=unit.name&page_size=1&type=unit`, {
        signal,
      })
        .then(response => response.json())));

      // Add the query name and result count to an array
      data.forEach((res, i) => {
        const query = suggestions[i];
        if (res.count > 0) {
          /* If only one result found with a a sugestion, add the whole original name of the result,
         instead of only the split word that matches the query TODO: USE THIS OR NOT??!? */
          /* if (res.count === 1) {
            query = getLocaleText(res.results[0].name);
          } */
          searchData.push({ query, count: res.count });
        }
      });
      results = (searchData);
      if (results.length && results.length < listLength) {
        const amount = listLength - results.length;
        const largest = results.reduce((a, b) => (b.count > a.count ? b : a));
        const index = results.findIndex(item => item.query === largest.query);
        await expandSearch(results[index], getLocaleText, amount, signal)
          .then((data) => {
            data.expandedQueries.forEach((q) => {
              if (!results.some(e => e.query === q.query)) {
                results.splice(index + 1, 0, q);
              }
            });
          });
      }
    })
    .catch((response) => {
      results = 'error';
      console.log('error:', response);
    });
  return (results);
};

export default createSuggestions;
