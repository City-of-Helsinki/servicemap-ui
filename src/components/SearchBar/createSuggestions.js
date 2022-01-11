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
    fetch(`${config.serviceMapAPI.root}/search/?input=${query}&language=${locale}&page=1&page_size=1&type=address`, { signal })
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
  let matchingAreas = [];
  let matchingCategories = [];

  // Find matches for area names
  searchWords.forEach((word) => {
    const matches = areas.filter(item => intl.formatMessage({ id: `area.list.${item.id}` }).toLowerCase().includes(word) || item.searchWords.some(text => text.includes(word)));
    const categoryMatches = dataStructure.filter(
      item => item.searchWords?.some(text => text.toLowerCase().includes(word.toLowerCase())),
    );
    matchingAreas = [...matchingAreas, ...matches];
    matchingCategories = [...matchingCategories, ...categoryMatches];
  });
  const counts = matchingAreas.map(item => item.id).reduce((a, c) => {
    a[c] = (a[c] || 0) + 1;
    return a;
  }, {});

  const maxCount = Math.max(...Object.values(counts));
  const mostFrequent = Object.keys(counts).find(count => counts[count] === maxCount);

  if (mostFrequent) {
    suggestions.push({
      object_type: 'area',
      id: mostFrequent,
      name: intl.formatMessage({ id: `area.list.${mostFrequent}.plural` }),
    });
  }

  if (matchingCategories.length) {
    const match = matchingCategories[0];
    suggestions.push({
      object_type: 'area',
      id: match.id,
      name: intl.formatMessage({ id: `area.list.${match.id}` }),
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
