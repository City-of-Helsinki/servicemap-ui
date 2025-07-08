import config from '../../../config';
import { accessibilitySentencesFetch } from '../../utils/fetch';
import { accessibilitySentences } from './fetchDataActions';

// Fetch AccessibilitySentences
const { isFetching, setNewData, fetchError, fetchSuccess } =
  accessibilitySentences;

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
  if (base) {
    config.supportedLanguages.forEach((lang) => {
      obj[lang] = data[`${base}_${lang}`];
    });
  } else {
    data.forEach((element) => {
      obj[element.language] = element.value;
    });
  }
  return obj;
};

const parsePTVAccessibilitySentences = (data) => {
  const sentences = {};
  const groups = {};
  let i = 0;
  data.forEach((element) => {
    if (element.sentenceGroups) {
      const group = buildTranslatedObject(element.sentenceGroups);

      // Check if group already exists in groups
      let groupKey;
      Object.keys(groups).forEach((key) => {
        if (groups[key].fi === group.fi) {
          groupKey = key;
        }
      });
      if (!groupKey) {
        groups[i] = group;
      } else {
        i = groupKey;
      }
    }
    if (element.sentences) {
      const sentence = buildTranslatedObject(element.sentences);
      if (!(i in sentences)) {
        sentences[i] = [];
      }
      sentences[i].push(sentence);
    }
    i = i + 1;
  });

  if (Object.keys(sentences).length === 0 || Object.keys(groups).length === 0) {
    return null;
  }
  return { sentences, groups };
};

const parseHelsinkiAccessibilitySentences = (data) => {
  if (data && data.accessibility_sentences) {
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

/**
 * Parse accessibility sentences to more usable form
 * @param {*} data - fetched data from server
 */
export const parseAccessibilitySentences = (data) => {
  if (config.usePtvAccessibilityApi) {
    return parsePTVAccessibilitySentences(data);
  }
  return parseHelsinkiAccessibilitySentences(data);
};

// Change selected unit to given unit
export const changeAccessibilitySentences = (data) => async (dispatch) => {
  if (data) {
    const parsedData = parseAccessibilitySentences(data);
    dispatch(setNewData(parsedData));
  } else {
    dispatch(setNewData(null));
  }
};

export const fetchAccessibilitySentences = (id) => async (dispatch) => {
  const onStart = () => dispatch(isFetching());
  const onSuccess = (data) => {
    const parsedData = parseAccessibilitySentences(data);
    dispatch(fetchSuccess(parsedData));
  };
  const onError = (e) => dispatch(fetchError(e.message));

  // Fetch data
  accessibilitySentencesFetch({}, onStart, onSuccess, onError, null, id);
};

export default fetchAccessibilitySentences;
