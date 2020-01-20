/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect } from 'react-router-dom';
import {
  Paper, withStyles, Typography, Link, NoSsr, Divider,
} from '@material-ui/core';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import styles from './styles';
import Loading from '../../components/Loading/Loading';
import SearchBar from '../../components/SearchBar';
import { fitUnitsToMap } from '../MapView/utils/mapActions';
import { parseSearchParams } from '../../utils';
import TabLists from '../../components/TabLists';

import Container from '../../components/Container';
import { generatePath } from '../../utils/path';
import { DesktopComponent } from '../../layouts/WrapperComponents/WrapperComponents';
import SMButton from '../../components/ServiceMapButton';
import ExpandedSuggestions from '../../components/ExpandedSuggestions';
import SettingsInfo from '../../components/SettingsInfo';

class SearchView extends React.Component {
  constructor(props) {
    super(props);
    const { changeSelectedUnit } = props;

    this.state = {
      expandSearch: null,
    };

    // Reset selected unit on SearchView
    if (changeSelectedUnit) {
      changeSelectedUnit(null);
    }
  }

  componentDidMount() {
    const {
      fetchUnits, units, map,
    } = this.props;
    const searchData = this.getSearchParam();
    if (this.shouldFetch()) {
      if (searchData.type === 'search') {
        fetchUnits(searchData.query);
      } else {
        fetchUnits(searchData.query, searchData.type);
      }
      this.focusMap(units, map);
    }
  }

  shouldComponentUpdate(nextProps) {
    const { fetchUnits, units, map } = this.props;
    const searchData = this.getSearchParam(nextProps);
    if (this.shouldFetch(nextProps)) {
      if (searchData.type === 'search') {
        fetchUnits(searchData.query);
      } else {
        fetchUnits(searchData.query, searchData.type);
      }
      this.focusMap(units, map);
      return true;
    }
    // If new search results, call map focus functio
    if (nextProps.units.length > 0 && units !== nextProps.units) {
      this.focusMap(nextProps.units, map);
    }
    return true;
  }

  // Get search parameter from url
  getSearchParam = (props) => {
    const {
      location,
    } = props || this.props;
    const searchParams = parseSearchParams(location.search);
    if (searchParams.q) {
      return { type: 'search', query: searchParams.q };
    } if (searchParams.nodes) {
      return { type: 'node', query: searchParams.nodes };
    }
    return null;
  }

  // Check if view will fetch data because sreach params has changed
  shouldFetch = (props) => {
    const { isFetching, previousSearch } = props || this.props;
    const searchParam = this.getSearchParam(props);
    if (previousSearch && searchParam && searchParam.type === 'node') {
      return !isFetching && searchParam && searchParam.query !== previousSearch.searchQuery;
    }
    return !isFetching && searchParam && searchParam.query !== previousSearch;
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
    const addresses = data.filter(obj => obj && obj.object_type === 'address');

    return {
      services,
      units,
      addresses,
    };
  }

  // Handles redirect if only single result is found
  handleSingleResultRedirect() {
    const {
      units, getLocaleText, isFetching, match,
    } = this.props;

    // If not currently searching and view should not fetch new search
    // and only 1 result found redirect directly to specific result page
    if (!isFetching && !this.shouldFetch() && units && units.length === 1) {
      const {
        id, object_type, number, street,
      } = units[0];
      let path = null;
      // Parse language params
      const { params } = match;
      const lng = params && params.lng;
      const { name, municipality } = street || {};
      const streetName = name ? getLocaleText(name) : null;

      switch (object_type) {
        case 'address':
          path = generatePath('address', lng, { number, municipality, street: streetName });
          break;
        case 'unit':
          path = generatePath('unit', lng, { id });
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

  toggleExpanded() {
    const {
      location,
      navigator,
    } = this.props;
    const searchParams = parseSearchParams(location.search);

    navigator.replace('search', {
      ...searchParams,
      expand: this.expandSearchVisible() ? 0 : 1,
    });
  }

  expandSearchVisible() {
    const {
      location,
    } = this.props;
    const searchParams = parseSearchParams(location.search);

    return !!(searchParams.expand && searchParams.expand === '1');
  }

  closeExpandedSearch() {
    if (this.expandSearchVisible()) {
      this.toggleExpanded();
    }
  }

  openExpandedSearch() {
    if (!this.expandSearchVisible()) {
      this.toggleExpanded();
    }
  }

  handleSubmit(query) {
    const { isFetching, navigator } = this.props;
    if (!isFetching && query && query !== '') {
      this.closeExpandedSearch();

      if (navigator) {
        navigator.push('search', { q: query });
      }
    }
  }

  /**
   * What to render if no units are found with search
   */
  renderNotFound() {
    const {
      classes, isFetching, previousSearch, units,
    } = this.props;

    // These variables should be passed to this function
    const shouldRender = !isFetching && previousSearch && units && !units.length;
    const messageIDs = ['spelling', 'city', 'service', 'address', 'keyword'];

    return shouldRender && (
      <Container className={classes.noVerticalPadding}>
        <Container className={classes.noVerticalPadding}>
          <Typography align="left" variant="subtitle1" component="p">
            <FormattedMessage id="search.notFoundWith" values={{ query: previousSearch }} />
          </Typography>
        </Container>
        <Divider aria-hidden="true" />
        <Container className={classes.noVerticalPadding}>
          <Typography align="left" variant="subtitle1" component="p">
            <FormattedMessage id="search.tryAgain" />
          </Typography>
          <ul className={classes.list}>
            {
              messageIDs.map(id => (
                <li key={id}>
                  <Typography align="left" variant="body2" component="p">
                    <FormattedMessage id={`search.tryAgainBody.${id}`} />
                  </Typography>
                </li>
              ))
            }
          </ul>
        </Container>
      </Container>
    );
  }

  renderSearchBar() {
    const { query, classes } = this.props;

    if (this.expandSearchVisible()) {
      return null;
    }

    return (
      <SearchBar
        expand
        initialValue={query}
        className={classes.searchbarPlain}
      />
    );
  }

  renderSuggestions() {
    const { query } = this.props;

    return (
      <ExpandedSuggestions
        closeExpandedSearch={() => this.closeExpandedSearch()}
        searchQuery={query}
        handleSubmit={query => this.handleSubmit(query)}
        visible={this.expandSearchVisible()}
      />
    );
  }

  renderSearchInfo = () => {
    const { units, classes, isFetching } = this.props;
    const unitCount = units && units.length;

    return (
      <NoSsr>
        {!isFetching && (
          <div align="left" className={classes.searchInfo}>
            <div aria-live="polite" className={classes.infoContainer}>
              <Typography className={`${classes.infoText} ${classes.bold}`}>
                <FormattedMessage id="search.infoText" values={{ count: unitCount }} />
              </Typography>
            </div>
          </div>
        )}
      </NoSsr>
    );
  }

  renderExpandedSearchButton = () => {
    const {
      classes, units,
    } = this.props;
    const searchParam = this.getSearchParam();

    const unitCount = units && units.length;

    if (!unitCount || searchParam.type !== 'search') {
      return null;
    }

    return (
      <div className={classes.suggestionButtonContainer}>
        <SMButton
          small
          role="link"
          onClick={() => { this.openExpandedSearch(); }}
          messageID="search.expand"
        />
      </div>
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
        beforePagination: this.renderExpandedSearchButton(),
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
      {
        ariaLabel: `${intl.formatMessage({ id: 'address.plural' })} ${intl.formatMessage({ id: 'search.results.short' }, {
          count: groupedData
            .addresses.length,
        })}`,
        component: null,
        data: groupedData.addresses,
        itemsPerPage: 10,
        title: intl.formatMessage({ id: 'address.plural' }),
        noOrderer: true,
      },
    ];

    return (
      <TabLists
        data={searchResults}
      />
    );
  }

  /**
   * Render screen reader only information fields
   */
  renderScreenReaderInfo() {
    const {
      classes, isFetching, max,
    } = this.props;

    return (
      <Typography className={classes.srOnly} variant="srOnly" component="h3" tabIndex="-1">
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
      </Typography>
    );
  }

  render() {
    const {
      classes, isFetching, intl, count, max,
    } = this.props;
    const { expandSearch } = this.state;
    const progress = (isFetching && count) ? Math.floor((count / max * 100)) : 0;

    const redirect = this.handleSingleResultRedirect();

    if (redirect) {
      return redirect;
    }

    if (this.expandSearchVisible()) {
      return this.renderSuggestions();
    }

    return (
      <div
        className={classes.root}
      >
        {
          this.renderSearchBar()
        }
        {
          this.renderSuggestions()
        }
        {
          !expandSearch && this.renderSearchInfo()
        }
        <Paper className={!isFetching ? classes.noPadding : ''} elevation={1} square aria-live="polite">
          {
           !expandSearch && this.renderScreenReaderInfo()
          }
        </Paper>
        {
          !expandSearch && this.renderResults()
        }
        {
          isFetching
          && <Loading text={intl && intl.formatMessage({ id: 'search.loading.units' }, { count, max })} progress={progress} />
        }
        {
          <SettingsInfo />
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
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  changeSelectedUnit: PropTypes.func,
  count: PropTypes.number,
  fetchUnits: PropTypes.func,
  getLocaleText: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  isFetching: PropTypes.bool,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  max: PropTypes.number,
  previousSearch: PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(PropTypes.any)]),
  units: PropTypes.arrayOf(PropTypes.any),
  map: PropTypes.objectOf(PropTypes.any),
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  query: PropTypes.string,
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
  navigator: null,
  query: null,
};
