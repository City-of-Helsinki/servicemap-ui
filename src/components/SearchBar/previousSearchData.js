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

// Format single history object to correct format and return new data object
const formatSingleHistoryObject = (current) => {
  const today = new Date();
  if (!current) {
    return {
      weight: 1,
      weightedLastSearch: today.getTime(),
    };
  }

  let data = {};
  // Create new correctly formatted data object if current is old data
  if (typeof current === 'number') {
    data = {
      weight: current,
      weightedLastSearch: today.getTime() + current * halfDay,
    };
    return data;
  }

  // Update current data object weights and weightedLastSearch
  const searchWeight = (
    current
    && current?.weight > 0
      ? today.getTime() + current.weight * halfDay
      : today.getTime()
  );
  data = {
    weight: current && typeof current?.weight === 'number' ? current.weight + 1 : 1,
    weightedLastSearch: searchWeight,
  };
  return data;
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
    try {
      keys.forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(jsonData, key)) {
          const current = jsonData[key];
          // If old data still exists change to new format
          if (typeof current === 'number') {
            jsonData[key] = {
              weight: current,
              weightedLastSearch: new Date().getTime(),
            };
            return;
          }
          current.weight -= 1;
          if (current.weight < 0) {
            current.weight = 0;
          }
        }
      });
    } catch (e) {
      console.warn(`Error while updating previous search weights: ${e.message}`);
    }

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

  const current = jsonData[historyKey];
  jsonData[historyKey] = formatSingleHistoryObject(current);

  updateWeights(jsonData);

  LocalStorageUtility.saveItem(key, JSON.stringify(jsonData));
};
