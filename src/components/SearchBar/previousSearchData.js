import LocalStorageUtility from '../../utils/localStorage';

const toJson = (data = '[]') => JSON.parse(data);
const key = 'history:new';
const historyCount = 5;
const nextUpdateKey = 'history:updated';
const halfDay = 43200000; // Half day in milliseconds

// Update weights every 5 days
const updateWeights = (jsonData) => {
  const today = new Date();
  const nextUpdate = LocalStorageUtility.getItem(nextUpdateKey) || false;
  const nextUpdateDate = nextUpdate ? new Date(parseInt(nextUpdate, 10)) : null;

  if (!nextUpdateDate) {
    LocalStorageUtility.saveItem(nextUpdateKey, today.getTime());
    return;
  }

  // if 5 days has passed since last update
  const shouldUpdate = nextUpdateDate.getTime() < today.getTime();

  if (shouldUpdate) {
    try {
      jsonData.forEach((item) => {
        item.weight -= 1;
        if (item.weight < 0) {
          item.weight = 0;
        }
      });
    } catch (e) {
      console.warn(
        `Error while updating previous search weights: ${e.message}`
      );
    }

    LocalStorageUtility.saveItem(nextUpdateKey, today.getTime() + halfDay * 10);
  }
};

export const getPreviousSearches = () => {
  const history = LocalStorageUtility.getItem(key);
  const jsonHistory = toJson(history);

  if (jsonHistory) {
    // Remove possible duplicates
    const filteredHistory = jsonHistory.filter(
      (obj, index, array) =>
        index ===
        array.findIndex(
          (item) =>
            item.object_type === obj.object_type &&
            item.searchText?.toLowerCase() === obj.searchText?.toLowerCase()
        )
    );

    // Sort history
    const sortedHistory = filteredHistory.sort(
      (a, b) => b.weightedLastSearch - a.weightedLastSearch
    );
    return sortedHistory.slice(0, historyCount);
  }
  return null;
};

export const getFullHistory = () => {
  const history = LocalStorageUtility.getItem(key);
  return toJson(history);
};

export const saveSearchToHistory = (searchText, searchItem) => {
  if (!searchText || searchText === '' || !searchItem) return;
  const today = new Date();

  const data = LocalStorageUtility.getItem(key);
  let jsonData = [];
  if (data) {
    jsonData = toJson(data);
  }

  const current = jsonData.find(
    (item) =>
      item.searchText?.toLowerCase() === searchText.toLowerCase() &&
      item.object_type === searchItem.object_type
  );

  if (!current) {
    // Add new item to search history
    jsonData.push({
      searchText,
      ...searchItem,
      weight: 1,
      weightedLastSearch: today.getTime(),
    });
  } else {
    // Update previously searched item weights
    const searchWeight =
      current.weight > 0
        ? today.getTime() + current.weight * halfDay
        : today.getTime();
    current.weightedLastSearch = searchWeight;
    current.weight =
      typeof current.weight === 'number' ? current.weight + 1 : 1;
  }

  updateWeights(jsonData);

  LocalStorageUtility.saveItem(key, JSON.stringify(jsonData));
};

export const removeSearchFromHistory = (suggestion, callback) => {
  const data = LocalStorageUtility.getItem(key);
  let jsonData = [];
  if (data) {
    jsonData = toJson(data);
  }

  // Remove matching item from history
  jsonData = jsonData.filter(
    (item) =>
      !(
        item.searchText === suggestion.searchText &&
        item.object_type === suggestion.object_type
      )
  );

  LocalStorageUtility.saveItem(key, JSON.stringify(jsonData));

  callback();
};
