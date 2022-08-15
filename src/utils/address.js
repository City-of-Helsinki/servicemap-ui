/* eslint-disable prefer-destructuring */
import { useCallback } from 'react';
import useLocaleText from './useLocaleText';


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

export const getAddressNavigatorParamsConnector = (getLocaleText, address) => {
  if (typeof getLocaleText !== 'function') {
    throw Error('getAddressNavigatorParams requires getLocaleText function');
  }
  const nameObject = address.name || address.full_name;
  // TODO: why address endpoint returns different municipality object than search endpoint?
  const municipality = address.municipality.id || address.municipality.name.fi;

  return {
    municipality,
    name: getLocaleText(nameObject),
  };
};

export const getAddressText = (address, getLocaleText, showPostalCode = true) => {
  if (typeof getLocaleText !== 'function') {
    throw Error('getAddressText requires getLocaleText function');
  }

  if (address) {
    const nameObject = address.full_name || address.name;
    if (!nameObject) throw Error('getAddressText received address with no name');

    const addressName = getLocaleText(nameObject);
    const municipality = getLocaleText(address.municipality.name);
    const postalCode = showPostalCode && address.postal_code_area ? ` ${address.postal_code_area.postal_code}` : '';
    return `${addressName}, ${postalCode} ${municipality}`;
  }
  return '';
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
  const getLocaleText = useLocaleText();
  return useCallback(
    address => getAddressNavigatorParamsConnector(getLocaleText, address),
    [getLocaleText],
  );
};
