/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { FormattedMessage, intlShape } from 'react-intl';
import { Map, Mail, Hearing } from '@material-ui/icons';
import SearchBar from '../../components/SearchBar';
import { focusToPosition, focusDistrict } from '../MapView/utils/mapActions';
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
import TabLists from '../../components/TabLists';
import { AddressIcon } from '../../components/SMIcon';
import FeedbackView from '../FeedbackView';
import SocialMediaLinks from './components/SocialMediaLinks';
import UnitLinks from './components/UnitLinks';
import SimpleListItem from '../../components/ListItems/SimpleListItem';
import TitledList from '../../components/Lists/TitledList';
import DesktopComponent from '../../components/DesktopComponent';
import MobileComponent from '../../components/MobileComponent';

const UnitView = (props) => {
  const {
    distance,
    stateUnit,
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
    fetchHearingMaps,
    accessibilitySentences,
    eventsData,
    reservationsData,
    hearingMaps,
    unitFetching,
    userLocation,
    location,
  } = props;

  // Display feedback button only for units with these contract types
  const allowFeedbackIDs = ['municipal_service', 'purchased_service'];

  const checkCorrectUnit = unit => unit && unit.id === parseInt(match.params.unit, 10);

  const [unit, setUnit] = useState(checkCorrectUnit(stateUnit) ? stateUnit : null);

  const centerMap = () => {
    if (unit && map) {
      const { geometry, location } = unit;
      if (geometry && geometry.type === 'MultiLineString') {
        focusDistrict(map, [geometry.coordinates]);
      } else if (location) {
        focusToPosition(map, location.coordinates);
      }
    }
  };

  const intializeUnitData = () => {
    const { params } = match;
    const unitId = params.unit;
    // If no selected unit data, or selected unit data is old, fetch new data
    if (!stateUnit || !checkCorrectUnit(stateUnit) || !stateUnit.complete) {
      fetchSelectedUnit(unitId, unit => setUnit(unit));
      fetchAccessibilitySentences(unitId);
      fetchHearingMaps(unitId);
      fetchReservations(unitId);
      fetchUnitEvents(unitId);
    } else {
      // If selected unit data is correct, but some info is missing, fetch them
      if (!accessibilitySentences) {
        fetchAccessibilitySentences(unitId);
      }
      if (!reservationsData.data) {
        fetchReservations(unitId);
      }
      if (!eventsData.data) {
        fetchUnitEvents(unitId);
      }
    }
  };

  const handleFeedbackClick = () => {
    if (unit.municipality === 'espoo') {
      window.open('https://easiointi.espoo.fi/efeedback/');
    } else if (unit.municipality === 'vantaa') {
      window.open('https://asiointi.vantaa.fi/anna-palautetta');
    } else if (unit.municipality === 'kauniainen') {
      window.open('https://www.kauniainen.fi/kaupunki_ja_paatoksenteko/osallistu_ja_vaikuta');
    } else {
      navigator.openFeedback();
    }
  };

  const feedbackButton = () => {
    if (unit.contract_type
        && unit.contract_type.id
        && allowFeedbackIDs.includes(unit.contract_type.id)
    ) {
      return (
        <SMButton
          messageID="home.send.feedback"
          icon={<Mail />}
          onClick={() => handleFeedbackClick()}
          margin
        />
      );
    } return null;
  };

  useEffect(() => { // On mount
    intializeUnitData();
  }, []);

  useEffect(() => { // If unit changes without the component unmounting, update data
    if (unit) {
      intializeUnitData();
    }
  }, [match.params.unit]);

  useEffect(() => {
    centerMap();
  }, [unit, map]);

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
        <ContactInfo
          unit={unit}
          userLocation={userLocation}
          getLocaleText={getLocaleText}
          intl={intl}
        />
        <SocialMediaLinks unit={unit} getLocaleText={getLocaleText} />
        <Highlights unit={unit} getLocaleText={getLocaleText} />
        <Description unit={unit} getLocaleText={getLocaleText} />
        <UnitLinks unit={unit} />
        <ElectronicServices unit={unit} />
        <DesktopComponent>
          {feedbackButton()}
        </DesktopComponent>
      </div>
    );
  };

  const renderAccessibilityTab = () => {
    if (!unit || !unit.complete || !accessibilitySentences) {
      return <></>;
    }

    return (
      <div className={classes.content}>
        {hearingMaps && (
          <TitledList title={intl.formatMessage({ id: 'unit.accessibility.hearingMaps' })}>
            {hearingMaps.map(item => (
              <SimpleListItem
                role="link"
                link
                divider
                icon={<Hearing />}
                key={item.name}
                text={`${item.name} ${intl.formatMessage({ id: 'unit.opens.new.tab' })}`}
                handleItemClick={() => window.open(item.url)}
              />
            ))}
          </TitledList>
        )}
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
          listLength={5}
          reservationsData={reservationsData}
        />
        <Events classes={classes} listLength={5} eventsData={eventsData} />
      </div>
    );
  };

  const renderMobileButtons = () => (
    <MobileComponent>
      <div className={classes.mobileButtonArea}>
        <SMButton
          aria-hidden
          messageID="general.showOnMap"
          icon={<Map />}
          onClick={(e) => {
            e.preventDefault();
            if (navigator) {
              navigator.openMap();
            }
          }}
          margin
        />
        {feedbackButton()}
      </div>
    </MobileComponent>
  );

  const render = () => {
    const title = unit && unit.name ? getLocaleText(unit.name) : '';

    const TopArea = (
      <div className={`${classes.topArea}`}>
        <DesktopComponent>
          <SearchBar margin />
          <TitleBar
            icon={<AddressIcon className={classes.icon} />}
            title={title}
            distance={distance && distance.text}
          />
        </DesktopComponent>
        <MobileComponent>
          <TitleBar
            title={title}
            backButton
            distance={distance && distance.text}
          />
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

    if (location.search.includes('feedback=true')) {
      return (
        <FeedbackView />
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
        <div>
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
        </div>
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
  distance: PropTypes.shape({
    distance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    type: PropTypes.oneOf(['m', 'km']),
    text: PropTypes.string,
  }),
  unit: PropTypes.objectOf(PropTypes.any),
  embed: PropTypes.bool,
  eventsData: PropTypes.objectOf(PropTypes.any),
  map: PropTypes.objectOf(PropTypes.any),
  fetchAccessibilitySentences: PropTypes.func.isRequired,
  fetchReservations: PropTypes.func.isRequired,
  fetchSelectedUnit: PropTypes.func.isRequired,
  unitFetching: PropTypes.bool.isRequired,
  fetchUnitEvents: PropTypes.func.isRequired,
  match: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  getLocaleText: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  reservations: PropTypes.arrayOf(PropTypes.any),
  userLocation: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any).isRequired,
};

UnitView.defaultProps = {
  accessibilitySentences: null,
  distance: null,
  embed: false,
  eventsData: { events: null, unit: null },
  unit: null,
  match: {},
  map: null,
  navigator: null,
  reservations: null,
  userLocation: null,
};
