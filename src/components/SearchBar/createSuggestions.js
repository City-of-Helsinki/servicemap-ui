import config from '../../../config';
import { uppercaseFirst } from '../../utils';
import { dataStructure } from '../../views/AreaView/utils/districtDataHelper';

// TODO: need city (and locale?) parameters to new search fetch

const createSuggestions = async (query, signal, locale, intl) => {
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

  const data = await Promise.all([
    fetchSuggestions(`${config.serviceMapAPI.root}/suggestion/?q=${query}&language=${locale}`),
    fetchSuggestions(`${config.serviceMapAPI.root}/search/?input=${query}&language=${locale}&page=1&page_size=20&type=address`),
  ]);

  if (data[0] === 'error' && data[1] === 'error') {
    return 'error';
  }

  let suggestions = [];
  // Handle address fetch results
  if (data[1] !== 'error' && data[1].results?.length) {
    const streets = [...new Set(
      data[1].results.map(address => address.street.name[locale] || address.steet.name[0]),
    )];
    if (streets.length) {
      suggestions.push({
        object_type: 'address',
        query: streets[0],
        name: `${uppercaseFirst(streets[0])}, ${intl.formatMessage({ id: 'search.suggestions.addresses' })}`,
      });
    }
  }

  // Add area suggestions
  const areas = dataStructure.flatMap(item => item.districts);
  const searchWords = query.split(' ');
  let matchingArea;
  searchWords.forEach((word) => {
    matchingArea = areas.find(item => intl.formatMessage({ id: `area.list.${item}` }).toLowerCase().includes(word));
  });
  if (matchingArea) {
    suggestions.push({
      object_type: 'area',
      id: matchingArea,
      name: intl.formatMessage({ id: `area.list.${matchingArea}.plural` }),
    });
  }

  // Handle suggestion API results
  if (data[0] !== 'error' && data[0].suggestions && data[0].suggestions.length) {
    data[0].suggestions.forEach((element) => {
      if (!element.object_type) {
        element.object_type = 'suggestion';
      }
    });
    suggestions = [...suggestions, ...data[0].suggestions];
  }
  return suggestions;
};

export default createSuggestions;
