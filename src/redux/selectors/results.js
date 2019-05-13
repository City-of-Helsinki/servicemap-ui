import { getLocaleString } from './locale';

export const getOrderedData = (state, data, direction, order) => {
  const results = Array.from(data);

  // Alphabetical ordering
  if (order === 'alphabetical') {
    results.sort((a, b) => {
      const x = getLocaleString(state, a.name).toLowerCase();
      const y = getLocaleString(state, b.name).toLowerCase();
      if (x > y) { return -1; }
      if (x < y) { return 1; }
      return 0;
    });

    if (direction === 'desc') {
      results.reverse();
    }
  } else {
    // Ordering based on match score
    results.sort((a, b) => {
      switch (order) {
        case 'match': {
          return direction === 'asc' ? a.score - b.score : b.score - a.score;
        }
        default: {
          return 0;
        }
      }
    });
  }

  return results;
};

export default {
  getOrderedData,
};
