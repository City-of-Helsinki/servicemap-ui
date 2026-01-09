/* eslint-disable react/forbid-prop-types */
import styled from '@emotion/styled';
import { ButtonBase, Divider, ListItem, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';

import { SMAccordion } from '../../../../components';
import { parseSearchParams, stringifySearchParams } from '../../../../utils';
import { getAddressFromUnit } from '../../../../utils/address';
import useLocaleText from '../../../../utils/useLocaleText';
import unitSectionFilter from '../../utils/unitSectionFilter';
import useRouteDetails from '../../utils/useRouteDetails';
import InfoList from '../InfoList';

function ContactInfo({
  unit,
  userLocation = null,
  headingLevel = 'h4',
  accessiblityTabRef = null,
}) {
  const intl = useIntl();
  const navigate = useNavigate();
  const location = useLocation();
  const getLocaleText = useLocaleText();
  const additionalEntrances = unit?.entrances?.filter(
    (entrance) => !entrance.is_main_entrance
  );
  const subgroupContacts = unit?.connections?.filter(
    (c) => c.section_type === 'SUBGROUP'
  );

  const showCallInfo =
    unit.call_charge_info &&
    unit.call_charge_info !== 'pvm/mpm' &&
    unit.call_charge_info.fi !== 'pvm/mpm';
  const address = {
    type: 'ADDRESS',
    value: unit.street_address
      ? getAddressFromUnit(unit, getLocaleText, intl)
      : intl.formatMessage({ id: 'unit.address.missing' }),
    noDivider: additionalEntrances?.length,
  };
  const otherAddressData = unit.connections?.find(
    (x) => x.section_type === 'OTHER_ADDRESS'
  );
  const phone = {
    type: 'PHONE',
    value: unit.phone
      ? { phone: unit.phone }
      : intl.formatMessage({ id: 'unit.phone.missing' }),
    // TODO: fix this hard coded value when unit data returns call charge boolean
    noDivider:
      showCallInfo || (subgroupContacts && subgroupContacts.length > 0),
  };
  const email = {
    type: 'EMAIL',
    value: unit.email
      ? { email: unit.email }
      : intl.formatMessage({ id: 'unit.email.missing' }),
  };
  const website = {
    type: 'LINK',
    value: unit.www
      ? {
          www: unit.www,
          name: intl.formatMessage({ id: 'unit.homepage' }),
        }
      : intl.formatMessage({ id: 'unit.homepage.missing' }),
  };

  const addNewTabSuffix = (text) =>
    `${text} ${intl.formatMessage({ id: 'opens.new.tab' })}`;

  // Custom list item component for call charge info
  const callInformation = {
    // TODO: fix this hard coded value when unit data returns call charge boolean
    component: showCallInfo && (
      <React.Fragment key="callInformation">
        <StyledAccordionItem>
          <StyledSMAccordion
            disableUnmount
            titleContent={
              <Typography>
                <FormattedMessage id="unit.phone.charge" />
              </Typography>
            }
            collapseContent={
              <StyledAccordionContainer>
                <StyledCallInfoText>
                  {typeof unit.call_charge_info === 'string'
                    ? unit.call_charge_info
                    : getLocaleText(unit.call_charge_info)}
                </StyledCallInfoText>
              </StyledAccordionContainer>
            }
          />
        </StyledAccordionItem>
        <li aria-hidden>
          <StyledShortDivider />
        </li>
      </React.Fragment>
    ),
  };

  // Custom list item component for additional entrances
  const entrances = {
    component: additionalEntrances?.length && (
      <React.Fragment key="entrances">
        <StyledAccordionItem>
          <StyledSMAccordion
            disableUnmount
            titleContent={
              <Typography id="additional-entrances">
                <FormattedMessage id="unit.entrances.show" />
              </Typography>
            }
            collapseContent={
              <StyledAccordionContainer data-sm="AdditionalEntranceContent">
                {additionalEntrances.map((entrance) =>
                  entrance.name ? (
                    <Typography key={getLocaleText(entrance.name)}>
                      {getLocaleText(entrance.name)}
                    </Typography>
                  ) : null
                )}
                <StyledAccessibilityLink
                  role="link"
                  onClick={() => {
                    // Navigate to accessibility tab by clicking tab
                    if (accessiblityTabRef.current) {
                      accessiblityTabRef.current.click();
                      accessiblityTabRef.current.focus();

                      return;
                    }

                    // Navigate to accessibility tab by changing url tab parameter
                    const searchParams = parseSearchParams(location.search);
                    searchParams.t = 'accessibilityDetails';
                    const searchString = stringifySearchParams(searchParams);

                    navigate(`${location.pathname}?${searchString}`);
                  }}
                >
                  <Typography>
                    {addNewTabSuffix(
                      intl.formatMessage({ id: 'unit.entrances.accessibility' })
                    )}
                  </Typography>
                </StyledAccessibilityLink>
              </StyledAccordionContainer>
            }
          />
        </StyledAccordionItem>
        <li aria-hidden>
          <StyledShortDivider />
        </li>
      </React.Fragment>
    ),
  };

  const otherAddress = {
    component: otherAddressData && (
      <React.Fragment key="otherAddress">
        <StyledAccordionItem>
          <StyledSMAccordion
            disableUnmount
            titleContent={
              <Typography data-sm="other-address">
                <FormattedMessage id="unit.otherAddress.show" />
              </Typography>
            }
            collapseContent={
              <StyledAccordionContainer>
                {otherAddressData.name ? (
                  <Typography>
                    {getLocaleText(otherAddressData.name)}
                  </Typography>
                ) : null}
                {otherAddressData.www ? (
                  <StyledAccessibilityLink
                    role="link"
                    onClick={() =>
                      window.open(getLocaleText(otherAddressData.www))
                    }
                  >
                    <Typography>
                      <FormattedMessage id="unit.otherAddress.link" />
                    </Typography>
                  </StyledAccessibilityLink>
                ) : null}
              </StyledAccordionContainer>
            }
          />
        </StyledAccordionItem>
        <li aria-hidden>
          <StyledShortDivider />
        </li>
      </React.Fragment>
    ),
  };

  const subgroups = {
    component: subgroupContacts?.length > 0 && (
      <React.Fragment key="entrances">
        <StyledAccordionItem>
          <StyledSMAccordion
            disableUnmount
            titleContent={
              <Typography>
                <FormattedMessage id="unit.subgroup.title" />
              </Typography>
            }
            collapseContent={
              <StyledAccordionContainer>
                {subgroupContacts.map((subgroup) =>
                  subgroup.contact_person ? (
                    <StyledSubGroupItem key={subgroup.contact_person}>
                      <Typography key={subgroup.contact_person}>
                        {`${subgroup.contact_person}, ${getLocaleText(subgroup.name)}, `}
                      </Typography>
                      <a href={`tel:${subgroup.phone}`}>{subgroup.phone}</a>
                    </StyledSubGroupItem>
                  ) : null
                )}
              </StyledAccordionContainer>
            }
          />
        </StyledAccordionItem>
        <li aria-hidden>
          <StyledShortDivider />
        </li>
      </React.Fragment>
    ),
  };

  // For infomration that is in data's connections array, use unitSectionFilter
  let openingHours = [];
  let contact = [];

  if (unit.connections) {
    const hours = unitSectionFilter(unit.connections, 'OPENING_HOURS');
    const hoursObject = unitSectionFilter(
      unit.connections,
      'OPENING_HOUR_OBJECT'
    );
    openingHours = [...hours, ...hoursObject];
    contact = unitSectionFilter(unit.connections, 'PHONE_OR_EMAIL');
  }

  // Form data array
  const data = [
    address,
    entrances,
    otherAddress,
    phone,
    subgroups,
    callInformation,
    email,
    website,
    ...(contact.length ? contact : []),
    ...(openingHours.length
      ? openingHours
      : [
          {
            type: 'OPENING_HOURS',
            value: intl.formatMessage({ id: 'unit.opening.hours.missing' }),
          },
        ]),
  ];

  // Get route details (hooks must be called at top level)
  const { routeUrl, extraText } = useRouteDetails(unit, userLocation);

  // Add route info to data in location exists
  const unitLocation = unit.location;
  if (unitLocation?.coordinates) {
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
}

const StyledShortDivider = styled(Divider)(({ theme }) => ({
  marginLeft: theme.spacing(9),
  marginRight: theme.spacing(-2),
}));

const StyledAccordionItem = styled(ListItem)(({ theme }) => ({
  padding: 0,
  paddingLeft: theme.spacing(7),
}));

const StyledSMAccordion = styled(SMAccordion)(({ theme }) => ({
  height: 32,
  marginBottom: theme.spacing(1),
}));

const StyledAccordionContainer = styled.div(({ theme }) => ({
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  paddingTop: 0,
}));

const StyledAccessibilityLink = styled(ButtonBase)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  color: theme.palette.link.main,
}));

const StyledCallInfoText = styled(Typography)(() => ({
  whiteSpace: 'pre-line',
}));

const StyledSubGroupItem = styled.div(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

ContactInfo.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
  userLocation: PropTypes.objectOf(PropTypes.any),
  headingLevel: PropTypes.string,
  accessiblityTabRef: PropTypes.shape({ current: PropTypes.any }),
};

export default ContactInfo;
