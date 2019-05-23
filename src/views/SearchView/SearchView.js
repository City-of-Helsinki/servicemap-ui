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

import Container from '../../components/Container/Container';
import { generatePath } from '../../utils/path';
import { DesktopComponent } from '../../layouts/WrapperComponents/WrapperComponents';

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

  // Filter callback function for search results
  sortCallback = (sortedData) => {
    const { isFetching, setNewSearchData } = this.props;
    if (!isFetching) {
      setNewSearchData(sortedData);
    }
  }

  /**
   * Handles redirect if only single result is found
   */
  handleSingleResultRedirect() {
    const {
      units, isFetching, match,
    } = this.props;

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
    return null;
  }

  /**
   * What to render if no units are found with search
   */
  renderNotFound() {
    const { isFetching, previousSearch, units } = this.props;

    // These variables should be passed to this function
    const shouldRender = !isFetching && previousSearch && units && !units.length;

    return shouldRender && (
      <Container>
        <Typography variant="subtitle1" component="p" aria-hidden="true">
          <FormattedMessage id="search.results" values={{ count: units.length }} />
        </Typography>
      </Container>
    );
  }

  /**
   * Render results
   */
  renderResults() {
    const {
      units, isFetching, intl,
    } = this.props;

    const showResults = !isFetching && units && units.length > 0;

    if (!showResults) {
      return null;
    }

    // Group data
    const groupedData = this.groupData(units);

    // Data for TabLists component
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

    return <TabLists data={searchResults} sortCallback={this.sortCallback} />;
  }

  /**
   * Render screen reader only information fields
   */
  renderScreenReaderInfo() {
    const {
      units, isFetching, max,
    } = this.props;
    const unitCount = units && units.length;

    return (
      <Typography style={{ position: 'fixed', left: -100 }} variant="srOnly" component="h3" tabIndex="-1">
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
    );
  }

  render() {
    const {
      isFetching, intl, count, max,
    } = this.props;
    const progress = (isFetching && count) ? Math.floor((count / max * 100)) : 0;

    const redirect = this.handleSingleResultRedirect();

    if (redirect) {
      return redirect;
    }

    // Hide paper padding when nothing is shown
    const paperStyles = {};
    if (!isFetching) {
      paperStyles.padding = 0;
    }


    return (
      <div className="Search">
        <SearchBar
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
            this.renderScreenReaderInfo()
          }
        </Paper>

        {
          this.renderResults()
        }
        {
          this.renderNotFound()
        }

        {
          // Jump link back to beginning of current page
        }
        <DesktopComponent>
          <Typography variant="srOnly" component="h3">
            <Link href="#view-title" tabIndex="-1">
              <FormattedMessage id="general.return.viewTitle" />
            </Link>
          </Typography>
        </DesktopComponent>
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
  intl: intlShape.isRequired,
  isFetching: PropTypes.bool,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  max: PropTypes.number,
  previousSearch: PropTypes.string,
  units: PropTypes.arrayOf(PropTypes.any),
  map: PropTypes.objectOf(PropTypes.any),
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  setNewSearchData: PropTypes.func.isRequired,
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
