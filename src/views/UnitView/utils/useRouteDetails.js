import { useIntl } from 'react-intl';

import config from '../../../../config';
import useLocaleText from '../../../utils/useLocaleText';

const useRouteDetails = (unit, userLocation) => {
  const intl = useIntl();
  const getLocaleText = useLocaleText();

  const unitLocation = unit.location;

  let currentLocationString = ' ';

  if (userLocation?.addressData) {
    const { street, number } = userLocation.addressData;
    const { latitude, longitude } = userLocation.coordinates;

    const userAddress = `${getLocaleText(street.name)} ${number}, ${street.municipality}`;
    currentLocationString = `${userAddress}::${latitude},${longitude}`;
  }
  let url = '';
  let extraText = '';

  if (config.hslRouteGuideCities?.includes(unit.municipality)) {
    url = config.hslRouteGuideURL;
    extraText = intl.formatMessage({ id: 'unit.route.extra.hslRouteGuide' });
  } else {
    url = config.reittiopasURL;
    extraText = intl.formatMessage({ id: 'unit.route.extra.routeGuide' });
  }

  let destinationString = `${getLocaleText(unit.name)}, ${unit.municipality}`;
  if (unitLocation) {
    destinationString += `::${unitLocation.coordinates[1]},${unitLocation.coordinates[0]}`;
  }
  const routeUrl = `${url}${currentLocationString}/${destinationString}?locale=${intl.locale}`;

  return { routeUrl, extraText };
};

export default useRouteDetails;
