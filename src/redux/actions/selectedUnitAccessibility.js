import { accessibilitySentences } from './fetchDataActions';
import { accessibilitySentencesFetch } from '../../utils/fetch';
import config from '../../../config';

// Fetch AccessibilitySentences
const {
  isFetching, setNewData, fetchError, fetchSuccess,
} = accessibilitySentences;

let currentId = 0;
const ids = {};
/**
 * Generate id using content text as key
 * @param {string} content
 */
const generateId = (content) => {
  if (!(content in ids)) {
    const id = currentId;
    ids[content] = id;
    currentId += 1;
  }

  return ids[content];
};

/**
 * Transform object to language locales as keys for texts
 * @param {object} data - object with texts
 * @param {string} base - base text for data object's key ie. ${base}_fi = content_fi
 */
const buildTranslatedObject = (data, base) => {
  const obj = {};
  config.supportedLanguages.forEach((lang) => {
    obj[lang] = data[`${base}_${lang}`];
  });
  return obj;
};

/**
 * Parse accessibility sentences to more usable form
 * @param {*} data - fetched data from server
 */
export const parseAccessibilitySentences = (data) => {
  if (data) {
    const sentences = {};
    const groups = {};

    // Parse accessibility_sentences
    data.accessibility_sentences.forEach((sentence) => {
      const group = buildTranslatedObject(sentence, 'sentence_group');
      const key = generateId(group.fi);
      groups[key] = group;

      if (!(key in sentences)) {
        sentences[key] = [];
      }
      const builtSentence = buildTranslatedObject(sentence, 'sentence');
      sentences[key].push(builtSentence);
    });

    return { sentences, groups };
  }

  return null;
};

// Change selected unit to given unit
export const changeAccessibilitySentences = data => async (dispatch) => {
  if (data) {
    const parsedData = parseAccessibilitySentences(data);
    dispatch(setNewData(parsedData));
  } else {
    dispatch(setNewData(null));
  }
};

export const fetchAccessibilitySentences = id => async (dispatch) => {
  const onStart = () => dispatch(isFetching());
  const onSuccess = (data) => {
    const parsedData = parseAccessibilitySentences(data);
    dispatch(fetchSuccess(parsedData));
  };
  const onError = e => dispatch(fetchError(e.message));

  // Fetch data
  accessibilitySentencesFetch({}, onStart, onSuccess, onError, null, id);
};

export default fetchAccessibilitySentences;
