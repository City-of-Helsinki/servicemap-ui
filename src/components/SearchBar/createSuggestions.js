import { uppercaseFirst } from '../../utils';

const pageSize = 50;
const listLength = 5;

const createSuggestions = async (query, getLocaleText) => {
  const results = [];
  await Promise.all([
    fetch(`https://api.hel.fi/servicemap/v2/search/?input=${query}&only=unit.name&page_size=${pageSize}&type=unit`)
      .then(response => response.json()),
    fetch(`https://api.hel.fi/servicemap/v2/search/?input=${query}&only=unit.location,unit.name,unit.municipality,unit.accessibility_shortcoming_count&page_size=5&type=unit`)
      .then(response => response.json())
      .then((data) => {
        data.results.forEach((unit) => {
          unit.object_type = 'unit';
        });
        return data;
      }),
  ])
    .then((data) => {
      console.log('data is: ', data);
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
    })
    .catch(response => console.log('error:', response));
  return (results);
};

export default createSuggestions;
