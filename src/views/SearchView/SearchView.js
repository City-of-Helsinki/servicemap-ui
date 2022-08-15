/* eslint-disable camelcase */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  Container, Divider, Link, NoSsr, Paper, Typography,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import fetchSearchResults from '../../redux/actions/search';
import fetchRedirectService from '../../redux/actions/redirectService';
import { parseSearchParams, getSearchParam, keyboardHandler } from '../../utils';
import { fitUnitsToMap } from '../MapView/utils/mapActions';
import { SearchBar } from '../../components';
import { generatePath, isEmbed } from '../../utils/path';
import SettingsUtility from '../../utils/settings';
import { useNavigationParams } from '../../utils/address';
import useMobileStatus from '../../utils/isMobile';
import ExpandedSuggestions from '../../components/ExpandedSuggestions';
import Loading from '../../components/Loading';
import TabLists from '../../components/TabLists';
import SettingsInfo from '../../components/SettingsInfo';
import { viewTitleID } from '../../utils/accessibility';
import { getOrderedData } from '../../redux/selectors/results';

const focusClass = 'TabListFocusTarget';

const SearchView = (props) => {
  const {
    classes, location, match, intl, query,
  } = props;
  const [serviceRedirect, setServiceRedirect] = useState(null);
  const [expandVisible, setExpandVisible] = useState(null);
  const [analyticsSent, setAnalyticsSent] = useState(null);

  const searchResultsData = useSelector(state => state.searchResults.data);
  const searchResults = useSelector(state => getOrderedData(state));
  const searchFetchState = useSelector(state => state.searchResults);
  const citySettings = useSelector(state => state.settings.cities);
  const isRedirectFetching = useSelector(state => state.redirectService.isFetching);
  const map = useSelector(state => state.mapRef);
  const navigator = useSelector(state => state.navigator);

  const getAddressNavigatorParams = useNavigationParams();
  const dispatch = useDispatch();
  const embed = isEmbed();
  const isMobile = useMobileStatus();

  const getResultsByType = type => searchResults.filter(item => item.object_type === type);

  const stringifySearchQuery = (data) => {
    try {
      const search = Object.keys(data).map(key => (`${key}:${data[key]}`));
      return search.join(',');
    } catch (e) {
      return '';
    }
  };

  const skipToContent = () => {
    const elem = document.getElementsByClassName(focusClass)[0];
    if (elem) {
      elem.focus();
    }
  };

  const getSearchParamData = (includeService = false) => {
    const redirectNode = serviceRedirect;
    const searchParams = parseSearchParams(location.search);

    const selectedCities = SettingsUtility.getActiveCitySettings(citySettings);

    const {
      q,
      category,
      city,
      municipality,
      service,
      serviceId,
      service_node,
      search_language,
      events,
      units,
    } = searchParams;

    const options = {};
    if (q) {
      options.q = q;
    } else {
      // Parse service
      if (includeService && service) {
        options.service = service;
      }

      // Parse service units
      if (serviceId) {
        options.serviceId = serviceId;
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

      if (units) {
        options.id = units;
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

    const settingMunicipality = selectedCities && selectedCities.join(',');

    // Parse municipality
    if (municipality || city || settingMunicipality) {
      options.municipality = municipality || city || settingMunicipality;
    }

    // Parse search language
    if (search_language) {
      options.search_language = search_language;
    }

    return options;
  };

  // Figure out if we are using search query or parameterized search
  const isInputSearch = () => {
    const searchParam = getSearchParamData();
    return !!searchParam.q;
  };

  // Handle service redirect for old service parameters if given
  // Will fetch new service_node from redirect endpoint with service parameter
  const handleServiceRedirect = () => {
    if (isRedirectFetching) {
      return true;
    }
    const options = getSearchParamData(true);
    if (options.service && serviceRedirect !== options.service) {
      // Reset serviceRedirect
      setServiceRedirect(null);

      // Fetch service_node for given old service data
      dispatch(fetchRedirectService({ service: options.service }, (data) => {
        // Success
        if (data.service_node) {
          // Need to stringify current search params for unit fetch
          // Otherwise componentDidMount shouldFetch will compare previous searches incorrectly
          delete options.service;
          options.service_node = `${(options.service_node ? `${options.service_node},` : '')}${data.service_node}`;

          // Set serviceRedirect and fetch units
          dispatch(fetchSearchResults(options));
          setServiceRedirect(options.service_node);
        }
      }));
      return true;
    }
    return false;
  };

  // Check if view will fetch data because sreach params has changed
  const shouldFetch = () => {
    const { isFetching, previousSearch } = searchFetchState;
    if (isFetching || isRedirectFetching) {
      return false;
    }
    const data = getSearchParamData();

    // Should fetch if previousSearch has changed and data has required parameters
    if (previousSearch) {
      if (data.q !== previousSearch && stringifySearchQuery(data) !== previousSearch) {
        return !!(data.q
          || data.service
          || data.service_node
          || data.serviceId
          || data.events);
      }
    } else {
      // Should fetch if no previous searches but search parameters exist
      return !!(data.q
        || data.service
        || data.service_node
        || data.serviceId
        || data.events
        || data.id);
    }
    return false;
  };

  const focusMap = (units) => {
    if (getSearchParam(location, 'bbox')) {
      return;
    }
    if (map && map.options.maxZoom) {
      fitUnitsToMap(units, map);
    }
  };

  // Handles redirect if only single result is found
  const handleSingleResultRedirect = () => {
    // If not currently searching and view should not fetch new search
    // and only 1 result found redirect directly to specific result page
    if (!searchFetchState.isFetching && searchResults?.length === 1 && !shouldFetch()) {
      const {
        id, object_type,
      } = searchResults[0];
      let path = null;
      // Parse language params
      const { params } = match;
      const lng = params && params.lng;
      switch (object_type) {
        case 'address':
          path = generatePath('address', lng, getAddressNavigatorParams(searchResults[0]), embed);
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
  };

  const renderExpandedSearch = () => {
    const unitCount = getResultsByType('unit').length;
    if (searchFetchState.isFetching || !unitCount || !isInputSearch()) {
      return null;
    }

    return (
      <ExpandedSuggestions
        searchQuery={query}
        onClick={() => {
          setExpandVisible(false);
          setTimeout(() => {
            const elem = document.getElementById('ExpandSuggestions');
            if (elem) {
              elem.focus();
            }
          }, 1);
        }}
        isVisible
        isMobile={isMobile}
      />
    );
  };

  useEffect(() => {
    const options = getSearchParamData();
    // Handle old service value redirects
    const handlingRedirect = handleServiceRedirect();

    if (!handlingRedirect) {
      if (shouldFetch() && Object.keys(options).length) {
        dispatch(fetchSearchResults(options));
      }
    }
  }, [match.params]);

  useEffect(() => { // Handle new search results
    if (searchResultsData.length) {
      // Focus map to new search results units
      const units = getResultsByType('unit');
      if (units.length) focusMap(units);
    } else {
      // Send analytics report if search query did not retutn results
      const { previousSearch, isFetching } = searchFetchState;
      if (navigator && previousSearch && !isFetching && analyticsSent !== previousSearch) {
        setAnalyticsSent(previousSearch);
        navigator.trackPageView(null, previousSearch);
      }
    }
  }, [searchResultsData]);

  const renderSearchBar = () => (
    <SearchBar expand className={classes.searchbarPlain} />
  );

  const renderSearchInfo = () => {
    const unitList = getResultsByType('unit');
    const unitCount = unitList.length || searchResults.length;
    const className = `SearchInfo ${classes.searchInfo}`;

    return (
      <NoSsr>
        <Typography
          role="link"
          tabIndex="-1"
          onClick={() => skipToContent()}
          onKeyPress={() => {
            keyboardHandler(() => skipToContent(), ['space', 'enter']);
          }}
          variant="srOnly"
        >
          <FormattedMessage id="search.skipLink" />
        </Typography>
        {!searchFetchState.isFetching && (
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
  };

  const renderScreenReaderInfo = () => {
    const { isFetching, max } = searchFetchState;
    return (
      <Paper className={!isFetching ? classes.noPadding : ''} elevation={1} square aria-live="polite">
        <Typography className={classes.srOnly} variant="srOnly" component="h3" tabIndex="-1">
          {!isFetching && (
            <FormattedMessage id="search.results.title" />
          )}
          {isFetching && max === 0 && (
            <FormattedMessage id="search.started" />
          )}
          {isFetching && max > 0 && (
            <FormattedMessage id="search.loading.units.srInfo" values={{ count: max }} />
          )}
        </Typography>
      </Paper>
    );
  };

  /**
   * Render results
   */
  const renderResults = () => {
    const showResults = searchResults.length && !searchFetchState.isFetching;

    // const showExpandedSearch = isInputSearch();

    if (!showResults) {
      return null;
    }

    const units = getResultsByType('unit');
    const services = getResultsByType('service');
    const addresses = getResultsByType('address');
    const events = getResultsByType('event');

    // Data for TabLists component
    const searchResultData = [
      {
        id: 'units',
        ariaLabel: `${intl.formatMessage({ id: 'unit.plural' })} ${intl.formatMessage({ id: 'search.results.short' }, {
          count: units.length,
        })}`,
        // beforePagination: showExpandedSearch ? this.renderExpandedSearchButton() : null,
        component: null,
        data: units,
        itemsPerPage: 10,
        title: intl.formatMessage({ id: 'unit.plural' }),
      },
      {
        id: 'services',
        ariaLabel: `${intl.formatMessage({ id: 'service.plural' })} ${intl.formatMessage({ id: 'search.results.short' }, {
          count: services.length,
        })}`,
        component: null,
        data: services,
        itemsPerPage: 10,
        title: intl.formatMessage({ id: 'service.plural' }),
      },
      {
        id: 'addresses',
        ariaLabel: `${intl.formatMessage({ id: 'address.plural' })} ${intl.formatMessage({ id: 'search.results.short' }, {
          count: addresses.length,
        })}`,
        component: null,
        data: addresses,
        itemsPerPage: 10,
        title: intl.formatMessage({ id: 'address.plural' }),
      },
      {
        id: 'events',
        ariaLabel: `${intl.formatMessage({ id: 'event.title' })} ${intl.formatMessage({ id: 'search.results.short' }, {
          count: events.length,
        })}`,
        component: null,
        data: events,
        itemsPerPage: 10,
        title: intl.formatMessage({ id: 'event.title' }),
      },
    ];

    return (
      <TabLists
        data={searchResultData}
        focusClass={focusClass}
        focusText={intl.formatMessage({ id: 'search.results.title' })}
      />
    );
  };

  /**
   * What to render if no units are found with search
  */
  const renderNotFound = () => {
    const { previousSearch, isFetching } = searchFetchState;

    const shouldRender = !isFetching && previousSearch && !searchResults.length;

    const messageIDs = ['spelling', 'city', 'service', 'address', 'keyword'];

    return shouldRender ? (
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
    ) : null;
  };


  const redirect = handleSingleResultRedirect();
  if (redirect) {
    return redirect;
  }
  if (embed) {
    return null;
  }
  if (expandVisible) {
    return renderExpandedSearch();
  }

  return (
    <div className={classes.root}>
      {renderSearchBar()}
      {renderSearchInfo()}
      {renderScreenReaderInfo()}
      {searchFetchState.isFetching ? (
        <Loading reducer={searchFetchState} />
      ) : renderResults() }
      <SettingsInfo />
      {renderNotFound()}
      {isMobile ? (
        // Jump link back to beginning of current page
        <Typography variant="srOnly" component="h3">
          <Link href={`#${viewTitleID}`} tabIndex="-1">
            <FormattedMessage id="general.return.viewTitle" />
          </Link>
        </Typography>
      ) : null}
    </div>
  );
};

export default SearchView;

// Typechecking
SearchView.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  query: PropTypes.string,
};

SearchView.defaultProps = {
  query: null,
};
