/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Typography, withStyles } from '@material-ui/core';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { fetchUnitEvents } from '../../redux/actions/event';
import { fetchSelectedUnit, changeSelectedUnit } from '../../redux/actions/selectedUnit';
import { getSelectedUnit } from '../../redux/selectors/selectedUnit';
import { getLocaleString } from '../../redux/selectors/locale';
import { DesktopComponent, MobileComponent } from '../../layouts/WrapperComponents/WrapperComponents';
import SearchBar from '../../components/SearchBar';
import { focusUnit, focusDistrict } from '../MapView/utils/mapActions';
import styles from './styles/styles';
import TitleBar from '../../components/TitleBar/TitleBar';
import Container from '../../components/Container';
import { uppercaseFirst } from '../../utils';
import fetchUnitReservations from './utils/fetchUnitReservations';
import AccessibilityInfo from './components/AccessibilityInfo';

import ContactInfo from './components/ContactInfo';
import Highlights from './components/Highlights';
import ElectronicServices from './components/ElectronicServices';
import Reservations from './components/Reservations';
import Description from './components/Description';
import Services from './components/Services';
import Events from './components/Events';
import ServiceMapButton from '../../components/ServiceMapButton';
import UnitIcon from '../../components/SMIcon/UnitIcon';
import TabLists from '../../components/TabLists';
import config from '../../../config';

class UnitView extends React.Component {
  constructor(props) {
    super(props);

    this.currentId = 0;
    this.ids = {};
    this.supportedLanguages = config.supportedLanguages;

    this.state = {
      centered: false,
      reservations: null,
      didMount: false,
    };
  }

  componentDidMount() {
    const {
      match, fetchSelectedUnit, unit,
    } = this.props;
    const { params } = match;

    this.setState({
      accessibilityInfoData: null,
      didMount: true,
    });

    if (params && params.unit) {
      const unitId = params.unit;

      fetchUnitReservations(unitId)
        .then(data => this.setState({ reservations: data.results }));

      if (unit && (unit.complete && unitId === `${unit.id}`)) {
        this.fetchAccessibilitySentences();
        return;
      }
      fetchSelectedUnit(unitId, () => this.fetchAccessibilitySentences());
    }
  }

  componentDidUpdate() {
    const {
      map, unit, eventFetching, eventsData, fetchUnitEvents, match,
    } = this.props;
    const { centered } = this.state;
    if (unit
      && unit.id === parseInt(match.params.unit, 10)
      && map
      && map._layersMaxZoom
      && !centered) {
      this.centerMap(map, unit);
    }
    if (unit && !eventFetching && (!eventsData.events || eventsData.unit !== unit.id)) {
      fetchUnitEvents(unit.id);
    }
  }

  centerMap = (map, unit) => {
    this.setState({ centered: true });
    const { geometry, location } = unit;
    if (geometry && geometry.type === 'MultiLineString') {
      focusDistrict(map, geometry.coordinates);
    } else if (location) {
      focusUnit(map, location.coordinates);
    }
  }

  /**
   * Transform object to language locales as keys for texts
   * @param {object} data - object with texts
   * @param {string} base - base text for data object's key ie. ${base}_fi = content_fi
   */
  buildTranslatedObject(data, base) {
    const obj = {};
    this.supportedLanguages.forEach((lang) => {
      obj[lang] = data[`${base}_${lang}`];
    });
    return obj;
  }

  /**
   * Parse accessibility sentences to more usable form
   * @param {*} data - fetched data from server
   */
  parseAccessibilitySentences(data) {
    if (data) {
      const sentences = {};
      const groups = {};

      // Parse accessibility_sentences
      data.accessibility_sentences.forEach((sentence) => {
        const group = this.buildTranslatedObject(sentence, 'sentence_group');
        const key = this.generateId(group.fi);
        groups[key] = group;

        if (!(key in sentences)) {
          sentences[key] = [];
        }
        const builtSentence = this.buildTranslatedObject(sentence, 'sentence');
        sentences[key].push(builtSentence);
      });

      return { sentences, groups };
    }

    return null;
  }

  /**
   * Generate id using content text as key
   * @param {string} content
   */
  generateId(content) {
    if (!(content in this.ids)) {
      const id = this.currentId;
      this.ids[content] = id;
      this.currentId += 1;
    }

    return this.ids[content];
  }

  /**
   * Fetch accessibility sentences from old API
   * AccessibilitySentences are fetched in UnitView to avoid multiple fetches
   * by AccessibilityInfo
   */
  async fetchAccessibilitySentences() {
    const BASE_URL = 'https://www.hel.fi/palvelukarttaws/rest/v4/unit/';
    const { unit } = this.props;

    if (!unit) {
      return;
    }

    const url = `${BASE_URL}${unit.id}`;

    try {
      const response = await fetch(url);
      if (response.ok && response.status === 200) {
        const data = await response.json();
        const parsedData = this.parseAccessibilitySentences(data);
        this.setState({
          accessibilityInfoData: parsedData,
        });
      } else {
        throw new Error(response.statusText);
      }
    } catch (e) {
      throw Error('Error fetching accessibility sentences', e.message);
    }
  }

  renderDetailTab() {
    const {
      getLocaleText, eventsData, navigator, unit,
    } = this.props;
    const { reservations } = this.state;

    if (!unit || !unit.complete) {
      return <></>;
    }

    return (
      <>
        {/* Show on map button for mobile */}
        <MobileComponent>
          <ServiceMapButton
            onClick={(e) => {
              e.preventDefault();
              this.setState({ centered: false });
              if (navigator) {
                navigator.push('unit', { id: unit.id, query: '?map=true' });
              }
            }}
          >
            <FormattedMessage id="general.showOnMap" />
          </ServiceMapButton>
        </MobileComponent>

        {/* View Components */}
        <Highlights unit={unit} getLocaleText={getLocaleText} />
        <ContactInfo unit={unit} />
        <ElectronicServices unit={unit} />
        <Reservations
          listLength={10}
          unitId={unit.id}
          reservations={reservations}
          getLocaleText={getLocaleText}
          navigator={navigator}
        />
        <Events listLength={5} eventsData={eventsData} />
      </>
    );
  }

  renderAccessibilityTab() {
    const {
      unit,
    } = this.props;
    const { accessibilityInfoData } = this.state;

    if (!unit || !unit.complete || !accessibilityInfoData) {
      return <></>;
    }

    return (
      <AccessibilityInfo titleAlways data={accessibilityInfoData} headingLevel={3} />
    );
  }

  renderServiceTab() {
    const {
      getLocaleText, navigator, unit,
    } = this.props;

    if (!unit || !unit.complete) {
      return <></>;
    }

    return (
      <>
        <Description unit={unit} getLocaleText={getLocaleText} />
        <Services
          listLength={10}
          unit={unit}
          navigator={navigator}
          getLocaleText={getLocaleText}
        />
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
      </>
    );
  }

  render() {
    const {
      classes, getLocaleText, intl, unit, eventsData, navigator, match, unitFetching,
    } = this.props;
    const { didMount, reservations } = this.state;

    const correctUnit = unit && unit.id === parseInt(match.params.unit, 10);

    const title = unit && unit.name ? getLocaleText(unit.name) : '';
    const icon = didMount && unit ? <UnitIcon unit={unit} /> : null;

    const TopBar = (
      <div className={`${classes.topBar} sticky`}>
        <DesktopComponent>
          <SearchBar placeholder={intl.formatMessage({ id: 'search' })} />
          <TitleBar icon={icon} title={title} primary />
        </DesktopComponent>
        <MobileComponent>
          <TitleBar icon={icon} title={correctUnit ? title : ''} primary backButton />
        </MobileComponent>
      </div>
    );

    if (unitFetching) {
      return (
        <div className={classes.root}>
          <div className="Content">
            {TopBar}
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
          component: this.renderDetailTab(),
          data: null,
          itemsPerPage: null,
          title: intl.formatMessage({ id: 'unit.basicInfo' }),
        },
        {
          ariaLabel: intl.formatMessage({ id: 'accessibility' }),
          component: this.renderAccessibilityTab(),
          data: null,
          itemsPerPage: null,
          title: intl.formatMessage({ id: 'accessibility' }),
        },
        {
          ariaLabel: intl.formatMessage({ id: 'service.plural' }),
          component: this.renderServiceTab(),
          data: null,
          itemsPerPage: null,
          title: intl.formatMessage({ id: 'service.plural' }),
        },
      ];
      return (
        <TabLists
          data={tabs}
          headerComponents={(
            <>
              {TopBar}

              {/* Unit image */}
              {unit.picture_url
                && (
                <img
                  className={classes.image}
                  alt={`${intl.formatMessage({ id: 'unit.picture' })}${getLocaleText(unit.name)}`}
                  src={unit.picture_url}
                />
                )
              }
            </>
        )}
        />
      );
    }

    if (unit && unit.complete) {
      return (
        <div className={classes.root}>
          <div className="Content">
            {TopBar}

            {/* Unit image */}
            {unit.picture_url
              && (
              <img
                className={classes.image}
                alt={`${intl.formatMessage({ id: 'unit.picture' })}${getLocaleText(unit.name)}`}
                src={unit.picture_url}
              />
              )
            }

            {/* Show on map button for mobile */}
            <MobileComponent>
              <ServiceMapButton
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({ centered: false });
                  if (navigator) {
                    navigator.push('unit', { id: unit.id, query: '?map=true' });
                  }
                }}
              >
                <FormattedMessage id="general.showOnMap" />
              </ServiceMapButton>
            </MobileComponent>

            {/* View Components */}
            <Highlights unit={unit} getLocaleText={getLocaleText} />
            <ContactInfo unit={unit} />
            <ElectronicServices unit={unit} />
            <Description unit={unit} getLocaleText={getLocaleText} />
            <Services
              listLength={10}
              unit={unit}
              navigator={navigator}
              getLocaleText={getLocaleText}
            />
            <Reservations
              listLength={10}
              unitId={unit.id}
              reservations={reservations}
              getLocaleText={getLocaleText}
              navigator={navigator}
            />
            <Events listLength={5} eventsData={eventsData} />
            <AccessibilityInfo titleAlways headingLevel={4} />

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
          </div>
        </div>
      );
    }
    return (
      <div className={classes.root}>
        <div className="Content">
          {TopBar}
          <Typography color="primary" variant="body1">
            <FormattedMessage id="unit.details.notFound" />
          </Typography>
        </div>
      </div>
    );
  }
}

// Listen to redux state
const mapStateToProps = (state) => {
  const unit = getSelectedUnit(state);
  const unitFetching = state.selectedUnit.isFetching;
  const eventsData = state.event.data;
  const eventFetching = state.event.isFetching;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const map = state.mapRef.leafletElement;
  const { navigator } = state;
  return {
    unit,
    unitFetching,
    eventsData,
    eventFetching,
    getLocaleText,
    map,
    navigator,
  };
};

export default withRouter(injectIntl(withStyles(styles)(connect(
  mapStateToProps,
  { changeSelectedUnit, fetchSelectedUnit, fetchUnitEvents },
)(UnitView))));

// Typechecking
UnitView.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any),
  eventsData: PropTypes.objectOf(PropTypes.any),
  map: PropTypes.objectOf(PropTypes.any),
  fetchSelectedUnit: PropTypes.func.isRequired,
  unitFetching: PropTypes.bool.isRequired,
  fetchUnitEvents: PropTypes.func.isRequired,
  eventFetching: PropTypes.bool.isRequired,
  match: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  getLocaleText: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
};

UnitView.defaultProps = {
  unit: null,
  eventsData: { events: null, unit: null },
  match: {},
  map: null,
  navigator: null,
};
