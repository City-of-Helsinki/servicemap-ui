import { uppercaseFirst } from '.';

export const getAddressText = (address, getLocaleText) => {
  if (!address || !address.number || !address.street.name || !address.street.municipality) {
    return '';
  }
  if (typeof getLocaleText !== 'function') {
    throw Error('getAddressText requires getLocaleText function');
  }
  const nStart = address.number;
  const nEnd = address.number_end ? `-${address.number_end}` : '';
  const letter = address.letter ? address.letter : '';
  const fullNumber = `${nStart}${nEnd}${letter}`;
  return `${getLocaleText(address.street.name)} ${fullNumber}, ${uppercaseFirst(address.street.municipality)}`;
};
