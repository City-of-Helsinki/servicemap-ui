import LocalStorageUtility from '../../utils/localStorage';

const toJson = (data = '{}') => JSON.parse(data);
const key = 'history';
const historyCount = 10;
const nextUpdateKey = 'history:updated';
const halfDay = 43200000; // Half day in milliseconds

const sortHistory = sortedObject => (a, b) => {
  if (
    Object.prototype.hasOwnProperty.call(sortedObject, a)
    && Object.prototype.hasOwnProperty.call(sortedObject, b)
  ) {
    const aCount = sortedObject[a].weightedLastSearch;
    const bCount = sortedObject[b].weightedLastSearch;
    return aCount < bCount ? 1 : -1;
  }
  return 0;
};

// Format old data stucture to new one
const formatOldData = (jsonData) => {
  try {
    const keys = Object.keys(jsonData);
    if (
      keys.length
      && Object.prototype.hasOwnProperty.call(jsonData, keys[0])
      && typeof jsonData[keys[0]] === 'number'
    ) {
      const data = {};
      keys.forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(jsonData, key)) {
          data[key] = {
            weight: 1,
            weightedLastSearch: new Date().getTime(),
          };
        }
      });
      return data;
    }
  } catch (e) {
    console.warn(`Unable to format old history data: ${e.message}`);
  }

  return jsonData;
};

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
  const keys = Object.keys(jsonData);

  if (shouldUpdate) {
    keys.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(jsonData, key)) {
        const current = jsonData[key];
        current.weight -= 1;
        if (current.weight < 0) {
          current.weight = 0;
        }
      }
    });

    LocalStorageUtility.saveItem(nextUpdateKey, today.getTime() + halfDay * 10);
  }
};

export const getPreviousSearches = () => {
  const history = LocalStorageUtility.getItem(key);
  const jsonHistory = toJson(history);

  if (jsonHistory) {
    // Sort history
    const historyKeys = Object.keys(jsonHistory).sort(sortHistory(jsonHistory));
    const searchHistory = historyKeys.slice(0, historyCount);
    return searchHistory;
  }
  return null;
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

  jsonData = formatOldData(jsonData);

  const current = jsonData[historyKey];
  const today = new Date();
  const searchWeight = (
    current
    && current.weight > 0
      ? today.getTime() + current.weight * halfDay
      : today.getTime()
  );
  jsonData[historyKey] = {
    weight: current && typeof current.weight === 'number' ? current.weight + 1 : 1,
    weightedLastSearch: searchWeight,
  };

  updateWeights(jsonData);

  LocalStorageUtility.saveItem(key, JSON.stringify(jsonData));
};
