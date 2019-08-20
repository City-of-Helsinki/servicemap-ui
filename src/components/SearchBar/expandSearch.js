import { uppercaseFirst } from '../../utils';

const expandSearch = async (item, getLocaleText, amount, signal) => {
  const listLength = amount || 10;
  const pageSize = 200;

  const results = await fetch(`https://api.hel.fi/servicemap/v2/search/?q=${item.query}&only=unit.name,unit.services&include=unit.services&page_size=${pageSize}`, {
    signal,
  })
    .then(response => response.json())
    .then((data) => {
      // Form list of suggested search prases
      const suggestions = [];
      for (let i = 0; suggestions.length < listLength && i < data.count; i += 1) {
        const result = data.results[i];
        if (result) {
        // Add extra words to original search query, based on services of the search results
          if (result.object_type === 'unit') {
            result.services.forEach((service) => {
              const query = item.query.toUpperCase();
              const serviceName = getLocaleText(service.name).toUpperCase();
              // Don't add the service if the original query already contains it
              if (!query.includes(serviceName)) {
                let phrase = `${item.query} ${getLocaleText(service.name)}`;
                if (serviceName.includes(query)) {
                  // Dont repeat same words in suggestion
                  phrase = uppercaseFirst(getLocaleText(service.name));
                }
                if (suggestions.indexOf(phrase) === -1 && suggestions.length < listLength) {
                // Add the new search phrase to list if it isn't there already
                  suggestions.push(phrase);
                }
              }
            });
          } else if (result.object_type === 'service') {
          // Do the same thing with results that are services instead of units
            if (!item.query.toUpperCase().includes(getLocaleText(result.name).toUpperCase())) {
              const phrase = `${item.query} ${getLocaleText(result.name)}`;
              if (suggestions.indexOf(phrase) === -1) {
                suggestions.push(phrase);
              }
            }
          }
        }
      }
      return suggestions;
    })
    .then(async (suggestions) => {
      const searchData = [];
      /* Fetch the result count of each suggestion,
      this fetch can be used if we get unique service count from backend */
      const data = await Promise.all(suggestions.map(word => fetch(`https://api.hel.fi/servicemap/v2/search/?q=${word}&only=unit.name&page_size=0&type=unit`)
        .then(response => response.json())));

      /* Fetch with each of the suggestions to find out the count and the number of unique services in the results
       (this is needed to see if we should show the "tarkenna" button) */
      // const data = await Promise.all(suggestions.map(word => fetch(`https://api.hel.fi/servicemap/v2/search/?q=${word}&only=unit.name,unit.services&page_size=100`)
      //  .then(response => response.json())));

      // Add the query name and result count to an array
      data.forEach((res, i) => {
        const query = suggestions[i];
        if (res.count > -1) { // this should be changed to > 0 when the backend returns correct results
          /* If only one result found with a a sugestion, add the whole original name of the result,
         instead of the query + service combination TODO: MAYBE NOT??! */
          /* if (res.count === 1) {
            query = getLocaleText(res.results[0].name);
          } */

          // Check for duplicates
          if (searchData && !searchData.some(e => e.query === query)) {
            searchData.push({ query, count: res.count });
          }
        }
      });

      return ({ search: item.query, expandedQueries: searchData });
    });
  return results;
};

export default expandSearch;
