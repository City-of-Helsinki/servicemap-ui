/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Paper, Typography } from '@material-ui/core';
import SearchBar from '../../components/SearchBar';
import TitleBar from '../../components/TitleBar/TitleBar';
import { DesktopComponent } from '../../layouts/WrapperComponents/WrapperComponents';
import { generatePath } from '../../utils/path';
import { drawServiceIcon } from '../Map/utils/drawIcon';
import { fitUnitsToMap } from '../Map/utils/mapActions';
import ResultList from '../../components/Lists/ResultList';
import Loading from '../../components/Loading/Loading';
import Container from '../../components/Container/Container';

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
      current, match, fetchService,
    } = this.props;
    const { params } = match;

    this.setState({
      icon: <img alt="" src={drawServiceIcon()} style={{ height: 24 }} />,
    });

    // Fetch service if current is not same as url param's
    if (!current || `${current.id}` !== params.service) {
      fetchService(params.service);
    }
  }

  componentDidUpdate() {
    const {
      current, unitData, match, map,
    } = this.props;
    const { params } = match;
    // Focus map if service is set and units exist
    if (current && `${current.id}` === params.service && unitData && unitData.length > 0) {
      // Focus map on unit
      this.focusMap(unitData, map);
    }
  }

  focusMap = (unit, map) => {
    const { mapMoved } = this.state;
    if (unit && map && map._layersMaxZoom && !mapMoved) {
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
      count, current, unitData, isLoading, max, getLocaleText, intl,
    } = this.props;
    const { icon } = this.state;
    const progress = (isLoading && count) ? Math.floor((count / max * 100)) : 0;

    let serviceUnits = null;
    if (unitData && unitData.length > 0) {
      serviceUnits = unitData;
      serviceUnits.forEach((unit) => {
        // eslint-disable-next-line no-param-reassign
        unit.object_type = 'unit';
      });
    }

    // Calculate visible components
    const showLoading = isLoading;
    const showTitle = current && current.name;
    const showUnits = serviceUnits;
    const showServiceWithoutUnits = current && !isLoading && !serviceUnits;

    return (
      <div>
        <DesktopComponent>
          <SearchBar placeholder={intl.formatMessage({ id: 'search' })} />
        </DesktopComponent>
        {
          showTitle
          && (
            <TitleBar icon={icon} title={getLocaleText(current.name)} />
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
            <ResultList
              listId="search-list"
              data={serviceUnits}
              title={intl.formatMessage({ id: 'unit.plural' })}
              onItemClick={(e, item) => this.handleClick(e, item)}
            />
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
  count: PropTypes.number.isRequired,
  current: PropTypes.objectOf(PropTypes.any),
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
  map: PropTypes.objectOf(PropTypes.any),
};

ServiceView.defaultProps = {
  current: null,
  match: {},
  history: {},
  unitData: {},
  map: null,
};

export default withRouter(injectIntl(ServiceView));
