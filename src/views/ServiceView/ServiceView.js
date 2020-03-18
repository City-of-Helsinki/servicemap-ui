/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Paper, Typography } from '@material-ui/core';
import SearchBar from '../../components/SearchBar';
import TitleBar from '../../components/TitleBar';
import { generatePath } from '../../utils/path';
import { fitUnitsToMap, focusToPosition } from '../MapView/utils/mapActions';
import Loading from '../../components/Loading/Loading';
import Container from '../../components/Container';
import PaginatedList from '../../components/Lists/PaginatedList';
import ResultOrderer from '../../components/TabLists/ResultOrderer';
import CustomLocation from '../../utils/customLocation';
import { getIcon } from '../../components/SMIcon';
import DesktopComponent from '../../components/DesktopComponent';
import MobileComponent from '../../components/MobileComponent';

class ServiceView extends React.Component {
  constructor(props) {
    super(props);
    this.listTitle = React.createRef();
    this.state = {
      mapMoved: false,
      icon: null,
    };
  }

  componentDidMount() {
    const {
      classes, match, fetchService,
    } = this.props;
    const { params } = match;

    this.setState({
      icon: getIcon('service', { className: classes.icon }),
    });

    // Fetch service if current is not same as url param's
    if (this.shouldFetch()) {
      fetchService(params.service);
    }
    const { changeCustomUserLocation, location } = this.props;

    const customLocation = new CustomLocation(location);
    if (customLocation.coords) {
      changeCustomUserLocation(customLocation.coords, customLocation.hideMarker);
      return;
    }
    changeCustomUserLocation(null);
  }

  componentDidUpdate(nextProps) {
    const {
      unitData,
    } = this.props;
    // Focus map if service is set and units exist
    if (unitData.length > 0 && unitData !== nextProps.unitData) {
      // Focus map on unit
      this.focusMap(unitData);
    }
  }

  componentWillUnmount() {
    const { changeCustomUserLocation } = this.props;
    changeCustomUserLocation(null);
  }

  // Check if view will fetch data because search params has changed
  shouldFetch = () => {
    const { current, isLoading, match } = this.props;
    const { params } = match;
    return !isLoading && (!current || `${current.id}` !== params.service);
  }

  focusMap = (unit) => {
    const { customPosition, map } = this.props;
    const { mapMoved } = this.state;
    if (!map || !map._layersMaxZoom || mapMoved) {
      return;
    }

    if (customPosition) {
      this.setState({ mapMoved: true });
      focusToPosition(
        map,
        [customPosition.longitude, customPosition.latitude],
      );
      return;
    }
    if (unit) {
      this.setState({ mapMoved: true });
      fitUnitsToMap(unit, map);
    }
  }

  handleClick = (e, item) => {
    const { history, match } = this.props;
    const { params } = match;
    const locale = params && params.lng;
    e.preventDefault();
    if (history && item) {
      history.push(generatePath('unit', locale, item.id));
    }
  }

  render() {
    const {
      classes, count, current, customPosition, embed, unitData, isLoading, max, getLocaleText, intl,
    } = this.props;
    const { icon } = this.state;
    const progress = (isLoading && count) ? Math.floor((count / max * 100)) : 0;

    if (embed) {
      return null;
    }

    let serviceUnits = null;
    if (unitData && unitData.length > 0) {
      serviceUnits = unitData;
    }

    // Calculate visible components
    const showLoading = isLoading;
    const showTitle = current && current.name;
    const showUnits = serviceUnits;
    const showServiceWithoutUnits = current && !isLoading && !serviceUnits;

    const initialOrder = customPosition ? 'distance-asc' : null;

    return (
      <div>
        <DesktopComponent>
          <SearchBar margin />
          {
            showTitle
            && (
              <TitleBar
                className={classes.titlebar}
                icon={icon}
                title={getLocaleText(current.name)}
              />
            )
          }
        </DesktopComponent>
        {
          showTitle
          && (
            <MobileComponent>
              <TitleBar
                className={classes.titlebar}
                icon={icon}
                title={getLocaleText(current.name)}
                primary
                backButton
              />
            </MobileComponent>
          )
        }
        {
          showLoading
          && (
            <Paper elevation={1} square aria-live="polite">
              <Loading text={intl && intl.formatMessage({ id: 'search.loading.units' }, { count, max })} progress={progress} />
            </Paper>
          )
        }
        {
          showUnits
          && (
            <>
              <ResultOrderer initialOrder={initialOrder} />
              <PaginatedList
                id="events"
                data={serviceUnits || []}
                title={intl.formatMessage({ id: 'unit.plural' })}
                titleComponent="h4"
              />
            </>
          )
        }
        {
          showServiceWithoutUnits
          && (
            <Container margin>
              <Typography variant="body1" align="left"><FormattedMessage id="service.units.empty" /></Typography>
            </Container>
          )
        }
      </div>
    );
  }
}

ServiceView.propTypes = {
  changeCustomUserLocation: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  count: PropTypes.number.isRequired,
  current: PropTypes.objectOf(PropTypes.any),
  customPosition: PropTypes.shape({
    latitude: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    longitude: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  embed: PropTypes.bool,
  match: PropTypes.objectOf(PropTypes.any),
  max: PropTypes.number.isRequired,
  history: PropTypes.objectOf(PropTypes.any),
  unitData: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.any),
    PropTypes.arrayOf(PropTypes.any),
  ]),
  isLoading: PropTypes.bool.isRequired,
  getLocaleText: PropTypes.func.isRequired,
  fetchService: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  map: PropTypes.objectOf(PropTypes.any),
};

ServiceView.defaultProps = {
  current: null,
  customPosition: null,
  embed: false,
  match: {},
  history: {},
  unitData: {},
  map: null,
};

export default withRouter(injectIntl(ServiceView));
