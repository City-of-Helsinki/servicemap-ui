/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect } from 'react-router-dom';
import {
  Paper, Divider, withStyles, Typography, Link,
} from '@material-ui/core';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import styles from './styles';
import Loading from '../../components/Loading/Loading';
import SearchBar from '../../components/SearchBar';
import { fitUnitsToMap } from '../Map/utils/mapActions';
import { parseSearchParams } from '../../utils';
import TabLists from '../../components/TabLists';

import paths from '../../../config/paths';
import Container from '../../components/Container/Container';
import { generatePath } from '../../utils/path';

class SearchView extends React.Component {
  constructor(props) {
    super(props);
    const { changeSelectedUnit } = props;

    // Reset selected unit on SearchView
    if (changeSelectedUnit) {
      changeSelectedUnit(null);
    }
  }

  componentDidMount() {
    const {
      fetchUnits, units, map, setCurrentPage,
    } = this.props;
    setCurrentPage('search');
    const searchParam = this.getSearchParam();
    if (this.shouldFetch()) {
      fetchUnits([], null, searchParam);
    }

    this.focusMap(units, map);
  }

  shouldComponentUpdate(nextProps) {
    const { units, map } = this.props;
    // If new search results, call map focus functio
    if (nextProps.units.length > 0 && units !== nextProps.units) {
      this.focusMap(nextProps.units, map);
    }
    return true;
  }

  // Get search parameter from url
  getSearchParam = () => {
    const {
      location,
    } = this.props;
    const searchParams = parseSearchParams(location.search);
    const searchParam = searchParams.q || null;
    return searchParam;
  }

  // Check if view will fetch data because search params has changed
  shouldFetch = () => {
    const { isFetching, previousSearch } = this.props;
    const searchParam = this.getSearchParam();
    return !isFetching && searchParam && searchParam !== previousSearch;
  }

  focusMap = (units, map) => {
    if (map && map._layersMaxZoom) {
      fitUnitsToMap(units, map);
    }
  }

  // Group data based on object types
  groupData = (data) => {
    const services = data.filter(obj => obj && obj.object_type === 'service');
    const units = data.filter(obj => obj && obj.object_type === 'unit');

    return {
      services,
      units,
    };
  }

  render() {
    const {
      units, isFetching, intl, count, fetchUnits, history, match, max, previousSearch,
    } = this.props;
    const unitCount = units && units.length;
    const resultsShowing = !isFetching && unitCount > 0;
    const progress = (isFetching && count) ? Math.floor((count / max * 100)) : 0;

    // If not currently searching and view should not fetch new search
    // and only 1 result found redirect directly to specific result page
    if (!isFetching && !this.shouldFetch() && units && units.length === 1) {
      // eslint-disable-next-line camelcase
      const { id, object_type } = units[0];
      let path = null;
      // Parse language params
      const { params } = match;
      const lng = params && params.lng;

      // eslint-disable-next-line camelcase
      switch (object_type) {
        case 'unit':
          path = generatePath('unit', lng, id);
          break;
        case 'service':
          path = generatePath('service', lng, id);
          break;
        default:
      }

      if (path) {
        return <Redirect to={path} />;
      }
    }

    // Group data
    const groupedData = this.groupData(units);

    // Data for TabResults component
    const searchResults = [
      {
        ariaLabel: `${intl.formatMessage({ id: 'unit.plural' })} ${intl.formatMessage({ id: 'search.results.short' }, {
          count: groupedData
            .units.length,
        })}`,
        component: null,
        data: groupedData.units,
        itemsPerPage: 10,
        title: intl.formatMessage({ id: 'unit.plural' }),
      },
      {
        ariaLabel: `${intl.formatMessage({ id: 'service.plural' })} ${intl.formatMessage({ id: 'search.results.short' }, {
          count: groupedData
            .services.length,
        })}`,
        component: null,
        data: groupedData.services,
        itemsPerPage: 10,
        title: intl.formatMessage({ id: 'service.plural' }),
      },
    ];

    // Hide paper padding when nothing is shown
    const paperStyles = {};
    if (!isFetching) {
      paperStyles.padding = 0;
    }

    return (
      <div className="Search">
        <SearchBar
          backButtonEvent={(e) => {
            e.preventDefault();
            history.goBack();

            // Listen history
            const unlisten = history.listen((location) => {
              // Get search params
              const searchParams = parseSearchParams(location.search);
              const searchParam = searchParams.q || null;

              // If page is search
              // and previousSearch is not current location's params
              // then fetch units with location's search params
              if (paths.search.regex.exec(location.pathname) && previousSearch !== searchParam) {
                fetchUnits([], null, searchParam);
              }
              unlisten(); // Remove listener
            });
          }}
          placeholder={intl && intl.formatMessage({ id: 'search.input.placeholder' })}
          text={this.getSearchParam() || ''}
        />
        <Divider aria-hidden="true" />
        <Paper elevation={1} square aria-live="polite" style={paperStyles}>
          {
            isFetching
            && <Loading text={intl && intl.formatMessage({ id: 'search.loading.units' }, { count, max })} progress={progress} />
          }

          {
            // Screen reader only information
          }
          <Typography variant="srOnly" component="h3" tabIndex="-1">
            {
              !isFetching
              && (
                <FormattedMessage id="search.results.title" />
              )
            }
            {
              isFetching && max === 0
              && <FormattedMessage id="search.started" />
            }
            {
              isFetching && max > 0
                && <FormattedMessage id="search.loading.units.srInfo" values={{ count: max }} />
            }
            {
              !isFetching
              && <FormattedMessage id="search.results" values={{ count: unitCount }} />
            }
          </Typography>
        </Paper>

        {
          // Show results
          resultsShowing
          && (
            <TabLists data={searchResults} />
          )
        }
        {
          !isFetching
          && previousSearch
          && units
          && units.length === 0
          && (
            <Container>
              <Typography variant="subtitle1" component="p" aria-hidden="true">
                <FormattedMessage id="search.results" values={{ count: units.length }} />
              </Typography>
            </Container>
          )
        }

        {
          // Jump link back to beginning of current page
        }
        <Typography variant="srOnly" component="h3">
          <Link href="#view-title" tabIndex="-1">
            <FormattedMessage id="general.return.viewTitle" />
          </Link>
        </Typography>
      </div>
    );
  }
}
export default withRouter(injectIntl(withStyles(styles)(SearchView)));

// Typechecking
SearchView.propTypes = {
  changeSelectedUnit: PropTypes.func,
  count: PropTypes.number,
  fetchUnits: PropTypes.func,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: intlShape.isRequired,
  isFetching: PropTypes.bool,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  max: PropTypes.number,
  previousSearch: PropTypes.string,
  units: PropTypes.arrayOf(PropTypes.any),
  map: PropTypes.objectOf(PropTypes.any),
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  setCurrentPage: PropTypes.func.isRequired,
};

SearchView.defaultProps = {
  changeSelectedUnit: () => {},
  count: 0,
  fetchUnits: () => {},
  isFetching: false,
  max: 0,
  previousSearch: null,
  units: [],
  map: null,
};
