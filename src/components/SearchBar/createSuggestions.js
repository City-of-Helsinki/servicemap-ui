import { uppercaseFirst } from '../../utils';
import suggestUnits from './suggestUnits';
import expandSearch from './expandSearch';

const pageSize = 50;
const listLength = 5;

const createSuggestions = async (query, getLocaleText) => {
  const results = [];
  await Promise.all([
    fetch(`https://api.hel.fi/servicemap/v2/search/?input=${query}&only=unit.name&page_size=${pageSize}&type=unit,service`)
      .then(response => response.json()),
    suggestUnits(query, true),
  ])
    .then((data) => {
      const resultData = data[0];
      const suggestions = [];
      // Form a list of suggestions from query results
      for (let i = 0; suggestions.length < listLength && i < pageSize && i < resultData.count; i += 1) {
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
      results.push(data[1].results);
      return suggestions;
    })
    .then(async (suggestions) => {
      const searchData = [];
      // Fetch the result count of each suggestion
      const data = await Promise.all(suggestions.map(word => fetch(`https://api.hel.fi/servicemap/v2/search/?q=${word}&only=unit.name&page_size=1&type=unit`)
        .then(response => response.json())));

      // Add the query name and result count to an array
      data.forEach((res, i) => {
        let query = suggestions[i];
        /* If only one result found with a a sugestion, add the whole original name of the result,
         instead of only the split word that matches the query */
        if (res.count > 0) {
          if (res.count === 1) {
            query = getLocaleText(res.results[0].name);
          }
          searchData.push({ query, count: res.count });
        }
      });
      results.push(searchData);
      /* if (results[1].length < listLength) {
        const amount = listLength - results[1].length;
        const index = 0;
        await expandSearch(results[1][0], getLocaleText, amount)
          .then((data) => {
            data.expandedQueries.forEach((q) => {
              results[1].splice(index + 1, 0, q);
            });
          });
      } */
    })
    .catch(response => console.log('error:', response));
  return (results);
};

export default createSuggestions;
