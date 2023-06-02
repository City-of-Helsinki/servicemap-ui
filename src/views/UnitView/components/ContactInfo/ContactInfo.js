import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  ButtonBase, Divider, ListItem, Typography,
} from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';
import config from '../../../../../config';
import InfoList from '../InfoList';
import unitSectionFilter from '../../utils/unitSectionFilter';
import { getAddressFromUnit } from '../../../../utils/address';
import useLocaleText from '../../../../utils/useLocaleText';
import { parseSearchParams, stringifySearchParams } from '../../../../utils';
import { SMAccordion } from '../../../../components';

const ContactInfo = ({
  unit, userLocation, intl, classes, headingLevel,
}) => {
  const history = useHistory();
  const location = useLocation();
  const getLocaleText = useLocaleText();
  const additionalEntrances = unit?.entrances?.filter(entrance => !entrance.is_main_entrance);
  const subgroupContacts = unit?.connections?.filter(c => c.section_type === 'SUBGROUP');

  const showCallInfo = unit.call_charge_info && unit.call_charge_info !== 'pvm/mpm' && unit.call_charge_info.fi !== 'pvm/mpm';
  const address = {
    type: 'ADDRESS',
    value: unit.street_address ? getAddressFromUnit(unit, getLocaleText, intl) : intl.formatMessage({ id: 'unit.address.missing' }),
    noDivider: additionalEntrances?.length,
  };
  const phone = {
    type: 'PHONE',
    value: unit.phone ? { phone: unit.phone } : intl.formatMessage({ id: 'unit.phone.missing' }),
    noDivider: showCallInfo || (subgroupContacts && subgroupContacts.length > 0), // TODO: fix this hard coded value when unit data returns call charge boolean
  };
  const email = {
    type: 'EMAIL',
    value: unit.email ? { email: unit.email } : intl.formatMessage({ id: 'unit.email.missing' }),
  };
  const website = {
    type: 'LINK',
    value: unit.www ? {
      www: unit.www,
      name: intl.formatMessage({ id: 'unit.homepage' }),
    } : intl.formatMessage({ id: 'unit.homepage.missing' }),
  };

  // Custom list item component for call charge info
  const callInformation = {
    component: showCallInfo // TODO: fix this hard coded value when unit data returns call charge boolean
      && (
        <React.Fragment key="callInformation">
          <ListItem className={classes.accordionItem}>
            <SMAccordion
              className={classes.accordionRoot}
              disableUnmount
              titleContent={<Typography><FormattedMessage id="unit.phone.charge" /></Typography>}
              collapseContent={(
                <div className={classes.accordionContaianer}>
                  <Typography className={classes.callInfoText}>
                    {typeof unit.call_charge_info === 'string' ? unit.call_charge_info : getLocaleText(unit.call_charge_info)}
                  </Typography>
                </div>
              )}
            />
          </ListItem>
          <li aria-hidden>
            <Divider className={classes.dividerShort} />
          </li>
        </React.Fragment>
      ),
  };

  // Custom list item component for additional entrances
  const entrances = {
    component: additionalEntrances?.length
    && (
      <React.Fragment key="entrances">
        <ListItem className={classes.accordionItem}>
          <SMAccordion
            className={classes.accordionRoot}
            disableUnmount
            titleContent={<Typography id="additional-entrances"><FormattedMessage id="unit.entrances.show" /></Typography>}
            collapseContent={(
              <div className={classes.accordionContaianer}>
                {additionalEntrances.map(entrance => (
                  entrance.name ? (
                    <Typography key={getLocaleText(entrance.name)}>
                      {getLocaleText(entrance.name)}
                    </Typography>
                  ) : null
                ))}
                <ButtonBase
                  role="link"
                  className={classes.accessibilityLink}
                  onClick={() => {
                    // Navigate to accessibility tab by changing url tab parameter
                    const searchParams = parseSearchParams(location.search);
                    searchParams.t = 'accessibilityDetails';
                    const searchString = stringifySearchParams(searchParams);
                    history.push(`${location.pathname}?${searchString}`);
                  }}
                >
                  <Typography>
                    <FormattedMessage id="unit.entrances.accessibility" />
                  </Typography>
                </ButtonBase>
              </div>
              )}
          />
        </ListItem>
        <li aria-hidden>
          <Divider className={classes.dividerShort} />
        </li>
      </React.Fragment>
    ),
  };

  const subgroups = {
    component: subgroupContacts?.length > 0 && (
      <React.Fragment key="entrances">
        <ListItem className={classes.accordionItem}>
          <SMAccordion
            className={classes.accordionRoot}
            disableUnmount
            titleContent={<Typography><FormattedMessage id="unit.subgroup.title" /></Typography>}
            collapseContent={(
              <div className={classes.accordionContaianer}>
                {subgroupContacts.map(subgroup => (
                  subgroup.contact_person ? (
                    <div key={subgroup.contact_person} className={classes.subgroupItem}>
                      <Typography key={subgroup.contact_person}>
                        {`${subgroup.contact_person}, ${getLocaleText(subgroup.name)}, `}
                      </Typography>
                      <a href={`tel:${subgroup.phone}`}>{subgroup.phone}</a>
                    </div>
                  ) : null
                ))}
              </div>
              )}
          />
        </ListItem>
        <li aria-hidden>
          <Divider className={classes.dividerShort} />
        </li>
      </React.Fragment>
    ),
  };

  // For infomration that is in data's connections array, use unitSectionFilter
  let openingHours = [];
  let contact = [];

  if (unit.connections) {
    const hours = unitSectionFilter(unit.connections, 'OPENING_HOURS');
    const hoursObject = unitSectionFilter(unit.connections, 'OPENING_HOUR_OBJECT');
    openingHours = [...hours, ...hoursObject];
    contact = unitSectionFilter(unit.connections, 'PHONE_OR_EMAIL');
  }


  // Form data array
  const data = [
    address,
    entrances,
    phone,
    subgroups,
    callInformation,
    email,
    website,
    ...contact.length ? contact : [],
    ...openingHours.length ? openingHours : [{ type: 'OPENING_HOURS', value: intl.formatMessage({ id: 'unit.opening.hours.missing' }) }],
  ];

  // Add route info to data in location exists
  const unitLocation = unit.location;

  if (unitLocation && unitLocation.coordinates) {
    // Temporary link implementation for route info
    let currentLocationString = ' ';

    if (userLocation && userLocation.addressData) {
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

    const destinationString = `${getLocaleText(unit.name)}, ${unit.municipality}::${unitLocation.coordinates[1]},${unitLocation.coordinates[0]}`;
    const routeUrl = `${url}${currentLocationString}/${destinationString}?locale=${intl.locale}`;

    const route = {
      type: 'ROUTE',
      value: {
        www: routeUrl,
        name: intl.formatMessage({ id: 'unit.route' }),
        extraText,
      },
    };
    data.push(route);
  }

  return (
    <InfoList
      data={data}
      title={<FormattedMessage id="unit.contact.info" />}
      titleComponent={headingLevel}
    />
  );
};

ContactInfo.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  userLocation: PropTypes.objectOf(PropTypes.any),
  headingLevel: PropTypes.string,
};

ContactInfo.defaultProps = {
  userLocation: null,
  headingLevel: 'h4',
};

export default ContactInfo;
