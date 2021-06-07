/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect } from 'react-router-dom';
import {
  Paper, withStyles, Typography, Link, NoSsr, Divider,
} from '@material-ui/core';
import { injectIntl, FormattedMessage } from 'react-intl';
import styles from './styles';
import Loading from '../../components/Loading';
import SearchBar from '../../components/SearchBar';
import { fitUnitsToMap } from '../MapView/utils/mapActions';
import { parseSearchParams, getSearchParam, keyboardHandler } from '../../utils';
import TabLists from '../../components/TabLists';
import SMButton from '../../components/ServiceMapButton';
import Container from '../../components/Container';
import { generatePath } from '../../utils/path';
import ExpandedSuggestions from '../../components/ExpandedSuggestions';
import SettingsInfo from '../../components/SettingsInfo';
import DesktopComponent from '../../components/DesktopComponent';
import MobileComponent from '../../components/MobileComponent';
import { viewTitleID } from '../../utils/accessibility';

class SearchView extends React.Component {
  focusClass = 'TabListFocusTarget';

  constructor(props) {
    super(props);

    this.state = {
      serviceRedirect: null,
      expandVisible: null,
    };
  }

  componentDidMount() {
    const {
      fetchUnits, units,
    } = this.props;
    const options = this.searchParamData();

    // Handle old service value redirects
    const handlingRedirect = this.handleServiceRedirect();
    if (handlingRedirect) {
      return;
    }

    if (this.shouldFetch() && Object.keys(options).length) {
      fetchUnits(options);
      this.focusMap(units);
    }
  }

  shouldComponentUpdate(nextProps) {
    const {
      fetchUnits, units,
    } = this.props;
    const {
      isRedirectFetching,
    } = nextProps;

    // Check if redirect fetch has stopped
    if (isRedirectFetching) {
      return false;
    }

    if (this.shouldFetch(nextProps)) {
      const searchData = this.searchParamData(nextProps);
      fetchUnits(searchData);
      this.focusMap(units);
      return false;
    }
    // If new search results, call map focus function
    if (nextProps.units.length > 0 && JSON.stringify(units) !== JSON.stringify(nextProps.units)) {
      this.focusMap(nextProps.units);
    }
    return true;
  }

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
    const options = this.searchParamData(null, true);
    if (options.service && serviceRedirect !== options.service) {
      // Reset serviceRedirect
      this.setState({ serviceRedirect: null });

      // Fetch service_node for given old service data
      fetchRedirectService({ service: options.service }, (data) => {
        // Success
        if (data.service_node) {
          // Need to stringify current search params for unit fetch
          // Otherwise componentDidMount shouldFetch will compare previous searches incorrectly
          delete options.service;
          options.service_node = `${(options.service_node ? `${options.service_node},` : '')}${data.service_node}`;

          // Set serviceRedirect and fetch units
          fetchUnits(options);
          this.setState({ serviceRedirect: options.service_node });
        }
      });
      return true;
    }
    return false;
  }

  stringifySearchQuery = (data) => {
    try {
      const search = Object.keys(data).map(key => (`${key}:${data[key]}`));
      return search.join(',');
    } catch (e) {
      return '';
    }
  }

  searchParamData = (props = null, includeService = false) => {
    const { location, citySettings } = props || this.props;
    const { serviceRedirect } = this.state;
    const redirectNode = serviceRedirect;
    const searchParams = parseSearchParams(location.search);

    const {
      q,
      category,
      city,
      municipality,
      service,
      service_node,
      search_language,
      events,
    } = searchParams;

    const options = {};
    if (q) {
      options.q = q;
    } else {
      // Parse service
      if (includeService && service) {
        options.service = service;
      }

      // Parse service_node
      if (service_node) {
        options.service_node = service_node;
      }
      if (!includeService && redirectNode) {
        options.service_node = redirectNode;
      }

      if (events) {
        options.events = events;
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

    const settingMunicipality = citySettings && citySettings.join(',');

    // Parse municipality
    if (municipality || city || settingMunicipality) {
      options.municipality = municipality || city || settingMunicipality;
    }

    // Parse search language
    if (search_language) {
      options.search_language = search_language;
    }

    return options;
  }

  // Check if view will fetch data because sreach params has changed
  shouldFetch = (props) => {
    const { isFetching, isRedirectFetching, previousSearch } = props || this.props;
    if (isFetching || isRedirectFetching) {
      return false;
    }
    const data = this.searchParamData(props);

    // Should fetch if previousSearch has changed and data has required parameters
    if (previousSearch) {
      if (data.q !== previousSearch && this.stringifySearchQuery(data) !== previousSearch) {
        return !!(data.q || data.service || data.service_node || data.events);
      }
    } else {
      // Should fetch if no previous searches but search parameters exist
      return !!(data.q || data.service || data.service_node || data.events);
    }
    return false;
  }

  focusMap = (units) => {
    const { location, map } = this.props;
    if (getSearchParam(location, 'bbox')) {
      return;
    }
    if (map && map.options.maxZoom) {
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
    const events = data.filter(obj => obj && obj.object_type === 'event');

    return {
      services,
      units,
      addresses,
      events,
    };
  }

  skipToContent = () => {
    const elem = document.getElementsByClassName(this.focusClass)[0];
    if (elem) {
      elem.focus();
    }
  }

  // Handles redirect if only single result is found
  handleSingleResultRedirect() {
    const {
      embed, units, getAddressNavigatorParams, isFetching, match,
    } = this.props;

    // If not currently searching and view should not fetch new search
    // and only 1 result found redirect directly to specific result page
    if (!isFetching && !this.shouldFetch() && units && units.length === 1) {
      const {
        id, object_type,
      } = units[0];
      let path = null;
      // Parse language params
      const { params } = match;
      const lng = params && params.lng;
      switch (object_type) {
        case 'address':
          path = generatePath('address', lng, getAddressNavigatorParams(units[0]), embed);
          break;
        case 'unit':
          path = generatePath('unit', lng, { id }, embed);
          break;
        case 'service':
          path = generatePath('service', lng, id, embed);
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
    const unitList = units && units.filter(i => i.object_type === 'unit');
    const unitCount = unitList && unitList.length;
    const className = `SearchInfo ${classes.searchInfo}`;

    return (
      <NoSsr>
        <Typography
          role="link"
          tabIndex="-1"
          onClick={this.skipToContent}
          onKeyPress={() => { keyboardHandler(this.skipToContent(), ['space', 'enter']); }}
          variant="srOnly"
        >
          <FormattedMessage id="search.skipLink" />
        </Typography>
        {!isFetching && (
          <div align="left" className={className}>
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
    const { classes } = this.props;
    return (
      <div className={classes.suggestionButtonContainer}>
        <SMButton
          id="ExpandSuggestions"
          small
          role="link"
          onClick={() => this.setState({ expandVisible: true })}
          messageID="search.expand"
        />
      </div>
    );
  }

  renderExpandedSearch = () => {
    const {
      isFetching, units, query,
    } = this.props;

    const unitCount = units && units.length;
    if (isFetching || !unitCount || !this.isInputSearch()) {
      return null;
    }

    return (
      <>
        <DesktopComponent>
          {/* TODO: Modify this class to functional component, to use useMobile hook
        instead of individual mobile/desktop components. */}
          <ExpandedSuggestions
            searchQuery={query}
            onClick={() => {
              this.setState({ expandVisible: false });
              setTimeout(() => {
                const elem = document.getElementById('ExpandSuggestions');
                if (elem) {
                  elem.focus();
                }
              }, 1);
            }}
            isVisible
          />
        </DesktopComponent>
        <MobileComponent>
          <ExpandedSuggestions
            searchQuery={query}
            onClick={() => {
              this.setState({ expandVisible: false });
              setTimeout(() => {
                const elem = document.getElementById('ExpandSuggestions');
                if (elem) {
                  elem.focus();
                }
              }, 1);
            }}
            isVisible
            isMobile
          />
        </MobileComponent>
      </>
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
    const showExpandedSearch = this.isInputSearch();

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
        beforePagination: showExpandedSearch ? this.renderExpandedSearchButton() : null,
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
      },
      {
        id: 'events',
        ariaLabel: `${intl.formatMessage({ id: 'event.title' })} ${intl.formatMessage({ id: 'search.results.short' }, {
          count: groupedData
            .events.length,
        })}`,
        component: null,
        data: groupedData.events,
        itemsPerPage: 10,
        title: intl.formatMessage({ id: 'event.title' }),
      },
    ];

    return (
      <TabLists
        data={searchResults}
        focusClass={this.focusClass}
        focusText={intl.formatMessage({ id: 'search.results.title' })}
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
      classes, isFetching, embed, unitsReducer,
    } = this.props;
    const { expandVisible } = this.state;

    const redirect = this.handleSingleResultRedirect();

    if (redirect) {
      return redirect;
    }

    if (embed) {
      return null;
    }

    if (expandVisible) {
      return this.renderExpandedSearch();
    }

    return (
      <div
        className={classes.root}
      >
        {
          this.renderSearchBar()
        }
        {
          this.renderSearchInfo()
        }
        <Paper className={!isFetching ? classes.noPadding : ''} elevation={1} square aria-live="polite">
          {
            this.renderScreenReaderInfo()
          }
        </Paper>
        <Loading reducer={unitsReducer}>
          {
            this.renderResults()
          }
        </Loading>
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
            <Link href={`#${viewTitleID}`} tabIndex="-1">
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
  embed: PropTypes.bool,
  fetchUnits: PropTypes.func,
  fetchRedirectService: PropTypes.func,
  getAddressNavigatorParams: PropTypes.func.isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  isFetching: PropTypes.bool,
  isRedirectFetching: PropTypes.bool,
  // eslint-disable-next-line react/no-unused-prop-types
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  max: PropTypes.number,
  previousSearch: PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(PropTypes.any)]),
  units: PropTypes.arrayOf(PropTypes.any),
  unitsReducer: PropTypes.objectOf(PropTypes.any),
  map: PropTypes.objectOf(PropTypes.any),
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  query: PropTypes.string,
};

SearchView.defaultProps = {
  embed: false,
  fetchUnits: () => {},
  fetchRedirectService: () => {},
  isFetching: false,
  isRedirectFetching: false,
  max: 0,
  previousSearch: null,
  units: [],
  unitsReducer: null,
  map: null,
  query: null,
};
