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

export default optionsToSearchQuery;
