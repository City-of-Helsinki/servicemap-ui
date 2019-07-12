import { uppercaseFirst } from '../../utils';

const pageSize = 20;

const createSuggestions = async (query, getLocaleText) => {
  let results = null;
  await fetch(`https://api.hel.fi/servicemap/v2/search/?input=${query}&only=unit.name&page_size=${pageSize}&type=unit`)
    .then(response => response.json())
    .then((data) => {
      const suggestions = [];
      // Form a list of suggestions from query results
      for (let i = 0; suggestions.length < 5 && i < pageSize; i += 1) {
        // Split result name strings words
        const words = getLocaleText(data.results[i].name).split(' ');
        let resultWord = null;
        // Find the word from result name that matches the original query
        words.some((word) => {
          resultWord = uppercaseFirst(word);
          return word.toUpperCase().indexOf(query.toUpperCase()) !== -1;
        });
        // Add the word to list of suggestions if it is not there already
        if (suggestions.indexOf(uppercaseFirst(resultWord)) === -1) {
          suggestions.push(resultWord);
        }
      }

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
        if (res.count === 1) {
          query = getLocaleText(res.results[0].name);
        }
        searchData.push({ query, count: res.count });
      });
      results = searchData;
    })
    .catch(response => console.log('error:', response));

  return (results);
};

export default createSuggestions;
