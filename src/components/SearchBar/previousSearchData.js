import LocalStorageUtility from '../../utils/localStorage';

const toJson = (data = '{}') => JSON.parse(data);
const key = 'history';
const historyCount = 10;

const sortHistory = sortedObject => (a, b) => {
  if (
    Object.prototype.hasOwnProperty.call(sortedObject, a)
    && Object.prototype.hasOwnProperty.call(sortedObject, b)
  ) {
    const aCount = sortedObject[a];
    const bCount = sortedObject[b];
    return aCount < bCount ? 1 : -1;
  }
  return 0;
};

export const getPreviousSearches = () => {
  const history = LocalStorageUtility.getItem(key);
  const jsonHistory = toJson(history);

  const historyKeys = Object.keys(jsonHistory).sort(sortHistory(jsonHistory));
  const searchHistory = historyKeys.slice(0, historyCount);

  return searchHistory;
};

export const saveSearchToHistory = (searchWord, results) => {
  if (!results || !results.length || searchWord === '') {
    return;
  }
  const historyKey = searchWord.toLowerCase();
  const data = LocalStorageUtility.getItem(key);
  let jsonData;
  if (!data) {
    jsonData = {};
  } else {
    jsonData = toJson(data);
  }
  const current = jsonData[historyKey];
  jsonData[historyKey] = typeof current === 'number' ? current + 1 : 1;

  LocalStorageUtility.saveItem(key, JSON.stringify(jsonData));
};
