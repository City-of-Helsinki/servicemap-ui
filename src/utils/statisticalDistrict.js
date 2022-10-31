// Calculate proportion related to given total
export const calculateProportion = (total, value) => {
  let proportion = 0;
  if (typeof total === 'number' && typeof value === 'number') {
    proportion = (value * 100) / total;
  }
  return proportion;
};
