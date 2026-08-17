/**
 * This function is used to convert search params to a string that is saved as "previousSearch"
 * @param options
 * @returns a query string representing the search params, not unique
 */
const optionsToSearchQuery = (options) =>
  options.q ||
  options.address ||
  options.service_node ||
  options.mobility_node ||
  options.service_id ||
  options.id ||
  options.events;

export const removeTrailingNumber = (searchQuery) => {
  if (!searchQuery) return searchQuery;

  let numberStart = searchQuery.length;
  while (numberStart > 0) {
    const characterCode = searchQuery.codePointAt(numberStart - 1);
    if (characterCode < 48 || characterCode > 57) break;
    numberStart -= 1;
  }

  return searchQuery.slice(0, numberStart);
};

export default optionsToSearchQuery;
