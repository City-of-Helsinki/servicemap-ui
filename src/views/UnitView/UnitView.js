/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { FormattedMessage, intlShape } from 'react-intl';
import { Map } from '@material-ui/icons';
import { DesktopComponent, MobileComponent } from '../../layouts/WrapperComponents/WrapperComponents';
import SearchBar from '../../components/SearchBar';
import { focusUnit, focusDistrict } from '../MapView/utils/mapActions';
import TitleBar from '../../components/TitleBar';
import Container from '../../components/Container';
import { uppercaseFirst } from '../../utils';
import AccessibilityInfo from './components/AccessibilityInfo';

import ContactInfo from './components/ContactInfo';
import Highlights from './components/Highlights';
import ElectronicServices from './components/ElectronicServices';
import Reservations from './components/Reservations';
import Description from './components/Description';
import Services from './components/Services';
import Events from './components/Events';
import SMButton from '../../components/ServiceMapButton';
import UnitIcon from '../../components/SMIcon/UnitIcon';
import TabLists from '../../components/TabLists';
import calculateDistance from '../../utils/calculateDistance';
import { AddressIcon } from '../../components/SMIcon';

const UnitView = (props) => {
  const [centered, setCentered] = useState(false);

  const {
    unit,
    map,
    intl,
    classes,
    getLocaleText,
    navigator,
    match,
    fetchSelectedUnit,
    fetchUnitEvents,
    fetchReservations,
    fetchAccessibilitySentences,
    accessibilitySentences,
    eventsData,
    reservations,
    unitFetching,
    userLocation,
  } = props;

  const centerMap = (map, unit) => {
    setCentered(true);
    const { geometry, location } = unit;
    if (geometry && geometry.type === 'MultiLineString') {
      focusDistrict(map, geometry.coordinates);
    } else if (location) {
      focusUnit(map, location.coordinates);
    }
  };

  const formatDistanceString = (meters) => {
    let distance = meters;
    if (distance) {
      if (distance >= 1000) {
        distance /= 1000; // Convert from m to km
        distance = distance.toFixed(1); // Show only one decimal
        distance = intl.formatNumber(distance); // Format distance according to locale
        return `${distance}km`;
      }
      return `${distance}m`;
    } return null;
  };


  useEffect(() => { // On mount
    const { params } = match;
    if (params && params.unit) {
      const unitId = params.unit;
      fetchReservations(unitId);

      if (unit && (unit.complete && unitId === `${unit.id}`)) {
        fetchAccessibilitySentences(unitId);
        return;
      }
      fetchSelectedUnit(unitId, () => fetchAccessibilitySentences(unitId));
    }
  }, []);

  useEffect(() => {
    if (unit) {
      if (map && !centered) {
        centerMap(map, unit);
      }
      fetchUnitEvents(unit.id);
    }
  }, [unit]);

  useEffect(() => {
    // If page is loaded before map, center map to unit after map is rendered
    if (map && unit && !centered) {
      centerMap(map, unit);
    }
  }, [map]);


  const renderDetailTab = () => {
    if (!unit || !unit.complete) {
      return <></>;
    }

    return (
      <div className={classes.content}>
        {/* Contract type */}
        <Container margin text>
          <Typography variant="body2">
            {
              unit.contract_type
              && unit.contract_type.description
              && `${uppercaseFirst(getLocaleText(unit.contract_type.description))}. `
            }
            {
              unit.data_source
              && <FormattedMessage id="unit.data_source" defaultMessage={'Source: {data_source}'} values={{ data_source: unit.data_source }} />
            }
          </Typography>
        </Container>

        {/* View Components */}
        <ContactInfo unit={unit} intl={intl} />
        <Highlights unit={unit} getLocaleText={getLocaleText} />
        <Description unit={unit} getLocaleText={getLocaleText} />
        <ElectronicServices unit={unit} />
      </div>
    );
  };

  const renderAccessibilityTab = () => {
    if (!unit || !unit.complete || !accessibilitySentences) {
      return <></>;
    }

    return (
      <div className={classes.content}>
        <AccessibilityInfo titleAlways data={accessibilitySentences} headingLevel={4} />
      </div>
    );
  };

  const renderServiceTab = () => {
    if (!unit || !unit.complete) {
      return <></>;
    }

    return (
      <div className={classes.content}>
        <Services
          listLength={10}
          unit={unit}
          getLocaleText={getLocaleText}
        />
        <Reservations
          listLength={10}
          reservations={reservations}
          getLocaleText={getLocaleText}
        />
        <Events listLength={5} eventsData={eventsData} />
      </div>
    );
  };

  const renderMobileButtons = () => (
    <MobileComponent>
      <div className={classes.mobileButtonArea}>
        <SMButton
          messageID="general.showOnMap"
          icon={<Map />}
          onClick={(e) => {
            e.preventDefault();
            setCentered(false);
            if (navigator) {
              navigator.openMap();
            }
          }}
          margin
        />
        {/* Feedback button
          <SMButton
            text={<FormattedMessage id="home.send.feedback" />}
            icon={<Mail />}
          /> */}
      </div>
    </MobileComponent>
  );

  const render = () => {
    const correctUnit = unit && unit.id === parseInt(match.params.unit, 10);

    const title = unit && unit.name ? getLocaleText(unit.name) : '';
    const icon = unit ? <UnitIcon unit={unit} /> : null;
    const distance = formatDistanceString(calculateDistance(unit, userLocation));

    const TopArea = (
      <div className={`${classes.topArea} sticky`}>
        <DesktopComponent>
          <SearchBar />
          <div className={classes.topPadding} />
          <TitleBar
            icon={<AddressIcon className={classes.icon} />}
            title={title}
            distance={distance}
          />
        </DesktopComponent>
        <MobileComponent>
          <TitleBar icon={icon} title={correctUnit ? title : ''} backButton />
        </MobileComponent>
      </div>
    );

    if (unitFetching) {
      return (
        <div className={classes.root}>
          <div className="Content">
            {TopArea}
            <p>
              <FormattedMessage id="general.loading" />
            </p>
          </div>
        </div>
      );
    }


    if (unit && unit.complete) {
      const tabs = [
        {
          ariaLabel: intl.formatMessage({ id: 'unit.basicInfo' }),
          component: renderDetailTab(),
          data: null,
          itemsPerPage: null,
          title: intl.formatMessage({ id: 'unit.basicInfo' }),
        },
        {
          ariaLabel: intl.formatMessage({ id: 'accessibility' }),
          component: renderAccessibilityTab(),
          data: null,
          itemsPerPage: null,
          title: intl.formatMessage({ id: 'accessibility' }),
        },
        {
          ariaLabel: intl.formatMessage({ id: 'service.tab' }),
          component: renderServiceTab(),
          data: null,
          itemsPerPage: null,
          title: intl.formatMessage({ id: 'service.tab' }),
        },
      ];
      return (
        <TabLists
          data={tabs}
          headerComponents={(
            <>
              {TopArea}
              {/* Unit image */}
              {
                unit.picture_url
                && (

                  <div className={classes.imageContainer}>
                    <img
                      className={classes.image}
                      alt={`${intl.formatMessage({ id: 'unit.picture' })}${getLocaleText(unit.name)}`}
                      src={unit.picture_url}
                    />
                    {
                      unit.picture_caption
                      && (
                        <Typography variant="body2" className={classes.imageCaption}>{getLocaleText(unit.picture_caption)}</Typography>
                      )
                    }
                  </div>
                )
              }
              {renderMobileButtons()}
            </>
          )}
        />
      );
    }

    return (
      <div className={classes.root}>
        <div className="Content">
          {TopArea}
          <Typography color="primary" variant="body1">
            <FormattedMessage id="unit.details.notFound" />
          </Typography>
        </div>
      </div>
    );
  };

  return render();
};

export default UnitView;

// Typechecking
UnitView.propTypes = {
  accessibilitySentences: PropTypes.objectOf(PropTypes.any),
  unit: PropTypes.objectOf(PropTypes.any),
  eventsData: PropTypes.objectOf(PropTypes.any),
  map: PropTypes.objectOf(PropTypes.any),
  fetchAccessibilitySentences: PropTypes.func.isRequired,
  fetchReservations: PropTypes.func.isRequired,
  fetchSelectedUnit: PropTypes.func.isRequired,
  unitFetching: PropTypes.bool.isRequired,
  fetchUnitEvents: PropTypes.func.isRequired,
  eventFetching: PropTypes.bool.isRequired,
  match: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  getLocaleText: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  reservations: PropTypes.arrayOf(PropTypes.any),
  userLocation: PropTypes.objectOf(PropTypes.any),
};

UnitView.defaultProps = {
  accessibilitySentences: null,
  unit: null,
  eventsData: { events: null, unit: null },
  match: {},
  map: null,
  navigator: null,
  reservations: null,
  userLocation: null,
};
