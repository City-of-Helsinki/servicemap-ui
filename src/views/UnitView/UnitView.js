/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Typography, withStyles } from '@material-ui/core';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { fetchUnitEvents } from '../../redux/actions/event';
import { fetchSelectedUnit, changeSelectedUnit } from '../../redux/actions/selectedUnit';
import { fetchAccessibilitySentences } from '../../redux/actions/selectedUnitAccessibility';
import { fetchReservations } from '../../redux/actions/selectedUnitReservations';
import { getSelectedUnit } from '../../redux/selectors/selectedUnit';
import { getLocaleString } from '../../redux/selectors/locale';
import { DesktopComponent, MobileComponent } from '../../layouts/WrapperComponents/WrapperComponents';
import SearchBar from '../../components/SearchBar';
import { focusUnit, focusDistrict } from '../MapView/utils/mapActions';
import styles from './styles/styles';
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
import ServiceMapButton from '../../components/ServiceMapButton';
import UnitIcon from '../../components/SMIcon/UnitIcon';
import TabLists from '../../components/TabLists';

class UnitView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      centered: false,
      didMount: false,
    };
  }

  componentDidMount() {
    const {
      match, fetchSelectedUnit, fetchReservations, unit, fetchAccessibilitySentences,
    } = this.props;
    const { params } = match;

    this.setState({
      didMount: true,
    });

    if (params && params.unit) {
      const unitId = params.unit;

      fetchReservations(unitId);

      if (unit && (unit.complete && unitId === `${unit.id}`)) {
        fetchAccessibilitySentences(unitId);
        return;
      }
      fetchSelectedUnit(unitId, () => fetchAccessibilitySentences(unitId));
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


  renderDetailTab() {
    const {
      getLocaleText, eventsData, navigator, reservations, unit,
    } = this.props;

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
        <Description unit={unit} getLocaleText={getLocaleText} />
        <ElectronicServices unit={unit} />
        <Reservations
          listLength={10}
          reservations={reservations}
          getLocaleText={getLocaleText}
        />
        <Events listLength={5} eventsData={eventsData} />
      </>
    );
  }

  renderAccessibilityTab() {
    const {
      accessibilitySentences,
      unit,
    } = this.props;

    if (!unit || !unit.complete || !accessibilitySentences) {
      return <></>;
    }

    return (
      <AccessibilityInfo titleAlways data={accessibilitySentences} headingLevel={4} />
    );
  }

  renderServiceTab() {
    const {
      getLocaleText, unit,
    } = this.props;

    if (!unit || !unit.complete) {
      return <></>;
    }

    return (
      <>
        <Services
          listLength={10}
          unit={unit}
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
      classes, getLocaleText, intl, unit, match, unitFetching,
    } = this.props;
    const { didMount } = this.state;

    const correctUnit = unit && unit.id === parseInt(match.params.unit, 10);

    const title = unit && unit.name ? getLocaleText(unit.name) : '';
    const icon = didMount && unit ? <UnitIcon unit={unit} /> : null;

    const TopBar = (
      <div className={`${classes.topBar} sticky`}>
        <DesktopComponent>
          <SearchBar placeholder={intl.formatMessage({ id: 'search.placeholder' })} />
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
            </>
        )}
        />
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
  const unitFetching = state.selectedUnit.unit.isFetching;
  const { accessibilitySentences } = state.selectedUnit;
  const eventsData = state.event.data;
  const eventFetching = state.event.isFetching;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const map = state.mapRef.leafletElement;
  const { navigator } = state;
  const reservations = state.selectedUnit.reservations.data;

  return {
    accessibilitySentences: accessibilitySentences.data,
    unit,
    unitFetching,
    eventsData,
    eventFetching,
    getLocaleText,
    map,
    navigator,
    reservations,
  };
};

export default withRouter(injectIntl(withStyles(styles)(connect(
  mapStateToProps,
  {
    changeSelectedUnit,
    fetchSelectedUnit,
    fetchUnitEvents,
    fetchAccessibilitySentences,
    fetchReservations,
  },
)(UnitView))));

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
};

UnitView.defaultProps = {
  accessibilitySentences: null,
  unit: null,
  eventsData: { events: null, unit: null },
  match: {},
  map: null,
  navigator: null,
  reservations: null,
};
