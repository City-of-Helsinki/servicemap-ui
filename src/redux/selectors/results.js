import { getLocaleString } from './locale';

export const getOrderedData = (state, data, direction, order) => {
  const results = Array.from(data);

  switch (order) {
    // Alphabetical ordering
    case 'alphabetical': {
      results.sort((a, b) => {
        const x = getLocaleString(state, a.name).toLowerCase();
        const y = getLocaleString(state, b.name).toLowerCase();
        if (x > y) { return -1; }
        if (x < y) { return 1; }
        return 0;
      });

      // If reversed alphabetical ordering
      if (direction === 'desc') {
        results.reverse();
      }
      break;
    }
    // Ordering based on match score
    case 'match': {
      // Using sort_index with assumption that default sort from API is relevance
      results.sort((a, b) => (direction === 'asc' ? b.sort_index - a.sort_index : a.sort_index - b.sort_index));
      break;
    }
    default:
  }

  return results;
};

export default {
  getOrderedData,
};
