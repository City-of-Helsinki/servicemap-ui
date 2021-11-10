import config from '../../../config';
import { dataStructure } from '../../views/AreaView/utils/districtDataHelper';

// TODO: need city (and locale?) parameters to new search fetch

const createSuggestions = async (query, signal, locale, intl) => {
  const data = await Promise.all([
    fetch(`${config.serviceMapAPI.root}/suggestion/?q=${query}&language=${locale}`, { signal })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        return 'error';
      })
      .catch((res) => {
        console.warn('error:', res);
        return 'error';
      }),
    fetch(`${config.serviceMapAPI.root}/search/?input=${query}&language=${locale}&page=1&page_size=3&type=address`, { signal })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        return 'error';
      })
      .catch((res) => {
        console.warn('error:', res);
        return 'error';
      }),
  ]);

  if (data[0] === 'error' && data[1] === 'error') {
    return 'error';
  }

  let suggestions = [];
  // Handle address fetch results
  if (data[1] !== 'error' && data[1].results && data[1].results.length) {
    suggestions = [...data[1].results];
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
