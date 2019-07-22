import { uppercaseFirst } from '../../utils';

// TODO: Check big searches are not showing correct counts. Most likely caused by page sizing

const pageSize = 40;
const suggestionsSize = 9;
let isFetching = false;

const fetchSuggestionWord = async (query, getLocaleText) => {
  let result = null;
  await fetch(`https://api.hel.fi/servicemap/v2/search/?input=${query}&only=unit.name&page_size=${pageSize}&type=unit,service`)
    .then(response => response.json())
    .then((data) => {
      if (!data || !data.results) {
        return null;
      }
      // Parse search word
      const words = [];
      data.results.forEach((result) => {
        const resultWords = getLocaleText(result.name).replace(/,/g, '').split(' ');

        let wordWithQuery = null;
        resultWords.some((word) => {
          if (word.toUpperCase().indexOf(query.toUpperCase()) !== -1) {
            wordWithQuery = uppercaseFirst(word);
            return true;
          }
          return false;
        });

        if (wordWithQuery) {
          if (typeof words[wordWithQuery] === 'number') {
            words[wordWithQuery] += 1;
          } else {
            words[wordWithQuery] = 1;
          }
        }
      });

      let searchWord = null;
      let currentSearchWordCount = 0;

      Object.keys(words).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(words, key)) {
          const value = words[key];
          if (currentSearchWordCount < value) {
            searchWord = key;
            currentSearchWordCount = value;
          }
        }
      });

      if (searchWord) {
        result = { query: searchWord };
      }

      return null;
    })
    .then(async (searchWord) => {
      if (!searchWord) {
        return null;
      }

      const data = await fetch(`https://api.hel.fi/servicemap/v2/search/?input=${searchWord}&only=unit.id&page_size=${pageSize}&type=unit,service`)
        .then(response => response.json());
      if (data && data.count) {
        result.count = data.count;
      }
      return null;
    })
    .catch(response => console.log('error:', response));

  return result;
};

const serviceMapFull = map => map && Object.keys(map).length >= suggestionsSize;

const fetchServices = async (query, gatheredData = {}, next = null) => {
  let fetchQuery = `https://api.hel.fi/servicemap/v2/search/?input=${query}&page_size=${pageSize}&only=unit.name&type=unit&include=unit.services`;
  if (next) {
    fetchQuery = next;
  }

  const data = await fetch(fetchQuery)
    .then(res => res.json());

  let serviceMap = gatheredData;

  // CALCULATE SERVICES to figure out suggestions
  if (!serviceMapFull(serviceMap)) {
    data.results.forEach((res) => {
      if (serviceMapFull(serviceMap)) {
        return;
      }
      if (res && res.services.length > 0) {
        const { services } = res;
        services.forEach((service) => {
          if (serviceMapFull(serviceMap)) {
            return;
          }
          if (service.name && service.id) {
            const { id } = service;
            if (!serviceMap[id]) {
              serviceMap[id] = { type: 'service', id };
            }
          }
        });
      }
    });
  }

  if (!serviceMapFull(serviceMap) && data.next) {
    serviceMap = await fetchServices(query, serviceMap, data.next);
  }
  return serviceMap;
};

const fetchCategorizedSuggestions = async (query) => {
  let results = null;

  await fetchServices(query)
    .then(async (serviceMap) => {
      const promiseArray = [];
      Object.keys(serviceMap).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(serviceMap, key)) {
          const current = serviceMap[key];
          const test = Promise.all([
            fetch(`https://api.hel.fi/servicemap/v2/${current.type === 'root' ? 'service_node' : 'service'}/?page=1&page_size=1&id=${key}&only=name`).then(res => res.json()),
            fetch(`https://api.hel.fi/servicemap/v2/search/?page=1&page_size=1&only=unit.id&q=${query}&${current.type === 'root' ? 'service_node' : 'service'}=${key}&type=unit,service`).then(res => res.json()),
          ]);
          promiseArray.push(test);
        }
      });

      results = promiseArray;
    })
    .catch(response => console.error('error:', response));

  return (results);
};

const createSuggestions = async (query, getLocaleText) => {
  if (isFetching) {
    return null;
  }
  isFetching = true;
  // First suggestion is the most common result word
  const results = [];

  await Promise.all([
    fetch(`https://api.hel.fi/servicemap/v2/search/?input=${query}&only=unit.location,unit.name,unit.municipality,unit.accessibility_shortcoming_count&page_size=3&type=unit,service`)
      .then(response => response.json()),
    fetchSuggestionWord(query, getLocaleText)
      .then(async (searchWord) => {
        const data = [];
        if (!searchWord) {
          return null;
        }
        data.push(searchWord);
        await fetchCategorizedSuggestions(searchWord.query, getLocaleText)
          .then(async (suggestions) => {
            await Promise.all(suggestions).then((promiseData) => {
              promiseData.forEach((service) => {
                const serviceObject = service[0].results[0];
                if (serviceObject) {
                  data.push({
                    query: searchWord.query,
                    count: service[1].count,
                    service: {
                      name: getLocaleText(serviceObject.name),
                      id: serviceObject.id,
                      object: serviceObject,
                    },
                  });
                }
              });
            });
          });
        return data;
      }),
  ])
    .then((data) => {
      results.push(data[0].results);
      results.push(data[1]);
    });

  isFetching = false;
  return results;
};

export default createSuggestions;
