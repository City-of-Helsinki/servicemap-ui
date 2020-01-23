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
import ExpandedSuggestions from '../../components/ExpandedSuggestions';
import SettingsInfo from '../../components/SettingsInfo';

class SearchView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expandSearch: null,
      /*
      serviceRedirect: {
        service: null,
        wasHandled: false,
      },
      */
    };
  }

  componentDidMount() {
    const {
      fetchUnits, units, map,
    } = this.props;
    const options = this.searchParamData();
    // Handle old service value redirects
    /*
    const handlingRedirect = this.handleServiceRedirect();
    if (handlingRedirect) {
      return;
    }
    */

    if (Object.keys(options).length) {
      fetchUnits(options);
      this.focusMap(units, map);
    }
  }

  shouldComponentUpdate(nextProps) {
    const { fetchUnits, units, map } = this.props;
    if (this.shouldFetch(nextProps)) {
      /*
      const handlingRedirect = this.handleServiceRedirect();
      if (handlingRedirect) {
        return false;
      }
      */
      const searchData = this.searchParamData();
      fetchUnits(searchData);
      this.focusMap(units, map);
      return true;
    }
    // If new search results, call map focus functio
    if (nextProps.units.length > 0 && units !== nextProps.units) {
      this.focusMap(nextProps.units, map);
    }
    return true;
  }

  /*
  // Handle service redirect for old service parameters if given
  // Will fetch new service_node from redirect endpoint with service parameter
  handleServiceRedirect = () => {
    const {
      fetchUnits, fetchRedirectService, isRedirectFetching,
    } = this.props;
    const {
      serviceRedirect,
    } = this.state;
    if (isRedirectFetching) {
      return true;
    }
    const options = this.searchParamData();
    if (options.service && serviceRedirect.service !== options.service) {
      // Set new state object for serviceRedirect
      const obj = {
        service: null,
        wasHandled: false,
      };
      this.setState({ serviceRedirect: obj });
      // Fetch service_node for given old service data
      fetchRedirectService({ service: options.service }, (data) => {
        // Success
        if (data.service_node) {
          // Need to stringify current search params for unit fetch
          // Otherwise componentDidMount shouldFetch will compare previous searches incorrectly
          const searchParams = this.stringifySearchQuery(options);
          delete options.service;
          options.service_node = data.service_node;

          // Set serviceRedirect to wasHandled
          this.setState({ serviceRedirect: { service: options.service, wasHandled: true } });
          fetchUnits(searchParams, 'params', null, options);
        }
      });
      return true;
    }
    return false;
  }
  */

  stringifySearchQuery = (data) => {
    try {
      const search = Object.keys(data).map(key => (`${key}:${data[key]}`));
      return search.join(',');
    } catch (e) {
      return '';
    }
  }

  searchParamData = (props = null) => {
    const {
      location,
    } = props || this.props;
    const searchParams = parseSearchParams(location.search);

    const {
      q,
      category,
      city,
      municipality,
      service,
      service_node,
    } = searchParams;

    const options = {};
    if (q) {
      options.q = q;
    } else {
      // Parse service
      if (service) {
        options.service = service;
      }

      // Parse service_node
      if (service_node) {
        options.service_node = service_node;
      }

      if (category) {
        const data = category.split(',');

        // Parse services
        const services = data.reduce((result, item) => {
          if (item.indexOf('service:') === 0) {
            result.push(item.split(':')[1]);
          }
          return result;
        }, []);

        if (services.length) {
          options.service = services.join(',');
        }

        // Parse serviceNodes
        const serviceNodes = data.reduce((result, item) => {
          if (item.indexOf('service_node:') === 0) {
            result.push(item.split(':')[1]);
          }
          return result;
        }, []);

        if (serviceNodes.length) {
          options.service_node = serviceNodes.join(',');
        }
      }
    }

    // Parse municipality
    if (municipality || city) {
      options.municipality = municipality || city;
    }


    return options;
  }

  // Check if view will fetch data because sreach params has changed
  shouldFetch = (props) => {
    const { isFetching, previousSearch } = props || this.props;
    if (previousSearch && !this.isInputSearch()) {
      return !isFetching && this.stringifySearchQuery(this.searchParamData(props)) !== previousSearch;
    }
    return !isFetching && this.searchParamData(props).q !== previousSearch;
  }

  focusMap = (units, map) => {
    if (map && map._layersMaxZoom) {
      fitUnitsToMap(units, map);
    }
  }

  // Figure out if we are using search query or parameterized search
  isInputSearch = () => {
    const searchParam = this.searchParamData();
    return !!searchParam.q;
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

  expandSearchVisible() {
    const {
      location,
    } = this.props;
    const searchParams = parseSearchParams(location.search);

    return !!(searchParams.expand && searchParams.expand === '1');
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
            <FormattedMessage id={typeof previousSearch === 'string' ? 'search.notFoundWith' : 'search.notFound'} values={{ query: previousSearch }} />
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
      classes, isFetching, units, query,
    } = this.props;

    const unitCount = units && units.length;

    if (isFetching || !unitCount || this.isInputSearch()) {
      return null;
    }

    return (
      <div className={classes.suggestionButtonContainer}>
        <ExpandedSuggestions
          searchQuery={query}
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
      classes, embed, isFetching, intl, count, max,
    } = this.props;
    const { expandSearch } = this.state;
    if (embed) {
      return null;
    }
    const progress = (isFetching && count) ? Math.floor((count / max * 100)) : 0;

    const redirect = this.handleSingleResultRedirect();

    if (redirect) {
      return redirect;
    }

    return (
      <div
        className={classes.root}
      >
        {
          this.renderSearchBar()
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
  count: PropTypes.number,
  embed: PropTypes.bool,
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
  query: PropTypes.string,
};

SearchView.defaultProps = {
  count: 0,
  embed: false,
  fetchUnits: () => {},
  isFetching: false,
  max: 0,
  previousSearch: null,
  units: [],
  map: null,
  query: null,
};
