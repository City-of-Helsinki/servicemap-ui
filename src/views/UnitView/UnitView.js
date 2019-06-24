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
import { focusUnit, focusDistrict } from '../Map/utils/mapActions';
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

class UnitView extends React.Component {
  constructor(props) {
    super(props);
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
      didMount: true,
    });

    if (params && params.unit) {
      const unitId = params.unit;

      fetchUnitReservations(unitId)
        .then(data => this.setState({ reservations: data.results }));

      if (unit && (unit.complete && unitId === `${unit.id}`)) {
        return;
      }
      fetchSelectedUnit(unitId);
    }
  }

  componentDidUpdate() {
    const {
      map, unit, eventFetching, eventsData, fetchUnitEvents,
    } = this.props;
    const { centered } = this.state;
    if (unit && map && map._layersMaxZoom && !centered) {
      this.centerMap(map, unit);
    }
    if (unit && !eventFetching && (!eventsData.events || eventsData.unit !== unit.id)) {
      fetchUnitEvents(unit.id);
    }
  }

  centerMap = (map, unit) => {
    this.setState({ centered: true });
    const { geometry } = unit;
    if (geometry && geometry.type === 'MultiLineString') {
      focusDistrict(map, geometry.coordinates);
    } else {
      focusUnit(map, unit);
    }
  }

  render() {
    const {
      classes, getLocaleText, intl, unit, eventsData, navigator,
    } = this.props;
    const { didMount, reservations } = this.state;

    const title = unit && unit.name ? getLocaleText(unit.name) : '';
    const icon = didMount && unit ? <UnitIcon unit={unit} /> : null;

    const TopBar = (
      <div>
        <DesktopComponent>
          <SearchBar placeholder={intl.formatMessage({ id: 'search' })} />
        </DesktopComponent>
        <TitleBar icon={icon} title={title} />
      </div>
    );

    if (unit && !unit.complete) {
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
  const eventsData = state.event.data;
  const eventFetching = state.event.isFetching;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const map = state.mapRef.leafletElement;
  const { navigator } = state;
  return {
    unit,
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
