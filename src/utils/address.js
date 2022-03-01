/* eslint-disable prefer-destructuring */
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { uppercaseFirst } from '.';
import config from '../../config';
import useLocaleText from './useLocaleText';

// Gets translated municipality from configuration
const getTranslatedMunicipality = (address, getLocaleText) => {
  if (!address || !getLocaleText) {
    return null;
  }
  let municipality = getLocaleText(config.municipality)[address.street.municipality];
  if (municipality && typeof municipality === 'string') {
    municipality = municipality.toLowerCase(); // Transform to lowercase
  }
  return municipality;
};

export const addressMatchParamsToFetchOptions = (match) => {
  if (!match) {
    return null;
  }
  const data = {
    municipality_name: `${match.params.municipality}`,
    street: `${match.params.street}`,
    language: match.params.lng === 'sv' ? 'sv' : 'fi',
  };

  const { number } = match.params;
  const numberParam = number;

  if (numberParam.indexOf('-') > -1) {
    const parts = number.split('-');
    data.number = parts[0];
    if (parts.length === 2) {
      if (parts[1] !== '' && !Number.isNaN(Number(parts[1]))) {
        data.number_end = parts[1];
      } else {
        data.letter = parts[1];
      }
    }
  } else {
    data.number = numberParam;
  }

  return data;
};

export const getAddressNavigatorParamsConnector = (getLocaleText, locale, address) => {
  if (!address || !address.number || !address.street.name || !address.street.municipality) {
    return null;
  }
  if (typeof getLocaleText !== 'function') {
    throw Error('getAddressNavigatorParams requires getLocaleText function');
  }
  if (Object.keys(config.municipality).indexOf(locale) === -1) {
    throw Error(`getAddressNavigatorParams locale parameter must be one of ${Object.keys(config.municipality).toString()}`);
  }
  let municipality = config.municipality[locale][address.street.municipality];
  if (municipality && typeof municipality === 'string') {
    municipality = municipality.toLowerCase(); // Transform to lowercase
  }

  const nStart = address.number;
  const nEnd = address.number_end ? `-${address.number_end}` : '';
  const letter = address.letter ? `-${address.letter}` : '';
  const fullNumber = `${nStart}${nEnd}${letter}`;
  const data = {
    municipality,
    street: getLocaleText(address.street.name),
    number: fullNumber,
  };

  if (address.number_end) {
    data.number_end = address.number_end;
  }

  return data;
};

export const getAddressText = (address, getLocaleText, showPostalCode = true) => {
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
  const municipality = getTranslatedMunicipality(address, getLocaleText);
  const postalCode = showPostalCode && address.postal_code ? ` ${address.postal_code}` : '';
  return `${getLocaleText(address.street.name)} ${fullNumber},${postalCode} ${uppercaseFirst(municipality)}`;
};

export const getAddressFromUnit = (unit, getLocaleText, intl) => {
  if (!unit || !unit.street_address) {
    return '';
  }
  if (!unit.address_zip || !unit.municipality) {
    return typeof unit.street_address === 'string'
      ? unit.street_address
      : `${getLocaleText(unit.street_address)}`;
  }
  const { address_zip: addressZip } = unit;
  const postalCode = addressZip ? `, ${addressZip}` : '';
  const city = intl.formatMessage({
    id: `settings.city.${unit.municipality}`,
    defaultMessage: ' ',
  });

  return `${typeof unit.street_address === 'string' ? unit.street_address : getLocaleText(unit.street_address)}${postalCode} ${city}`;
};

export const useNavigationParams = () => {
  const locale = useSelector(state => state.user.locale);
  const getLocaleText = useLocaleText();
  return useCallback(
    address => getAddressNavigatorParamsConnector(getLocaleText, locale, address),
    [locale],
  );
};
