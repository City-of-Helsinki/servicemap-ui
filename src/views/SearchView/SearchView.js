/* eslint-disable camelcase */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useRouteMatch } from 'react-router-dom';
import {
  Paper, Typography, Link, NoSsr, Divider,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { FormattedMessage, useIntl } from 'react-intl';
import fetchSearchResults from '../../redux/actions/search';
import { parseSearchParams, getSearchParam, keyboardHandler } from '../../utils';
import { fitUnitsToMap } from '../MapView/utils/mapActions';
import { isEmbed } from '../../utils/path';
import { useNavigationParams } from '../../utils/address';
import useMobileStatus from '../../utils/isMobile';
import { viewTitleID } from '../../utils/accessibility';
import { getOrderedData } from '../../redux/selectors/results';
import {
  Container,
  Loading,
  SearchBar,
  SettingsInfo,
  TabLists,
} from '../../components';

const focusClass = 'TabListFocusTarget';

const SearchView = (props) => {
  const { classes } = props;
  const [serviceRedirect, setServiceRedirect] = useState(null);
  const [analyticsSent, setAnalyticsSent] = useState(null);

  const searchResults = useSelector(state => getOrderedData(state));
  const searchFetchState = useSelector(state => state.searchResults);
  const isRedirectFetching = useSelector(state => state.redirectService.isFetching);
  const map = useSelector(state => state.mapRef);
  const navigator = useSelector(state => state.navigator);

  const getAddressNavigatorParams = useNavigationParams();
  const dispatch = useDispatch();
  const embed = isEmbed();
  const isMobile = useMobileStatus();
  const location = useLocation();
  const match = useRouteMatch();
  const intl = useIntl();

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

    const {
      q,
      category,
      city,
      municipality,
      address,
      service,
      service_id,
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

      // Parse address search parameter
      if (address) {
        options.address = address;
      }

      // Parse service units
      if (service_id) {
        options.service_id = service_id;
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

    // Parse municipality
    if (municipality || city) {
      options.municipality = municipality || city;
    }

    // Parse search language
    if (search_language) {
      options.search_language = search_language;
    }

    return options;
  };

  // Check if view will fetch data because sreach params has changed
  const shouldFetch = () => {
    const { isFetching, previousSearch } = searchFetchState;
    if (isFetching || isRedirectFetching) {
      return false;
    }
    const data = getSearchParamData();
    const searchQuery = data.q || data.address || data.service_node || data.service_id;

    // Should fetch if previousSearch has changed and data has required parameters
    if (previousSearch) {
      if (searchQuery !== previousSearch && stringifySearchQuery(data) !== previousSearch) {
        return !!(searchQuery);
      }
    } else {
      // Should fetch if no previous searches but search parameters exist
      return !!(searchQuery);
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
    if (!searchFetchState.isFetching && !shouldFetch()) {
      const { id, object_type } = searchResults[0];
      switch (object_type) {
        case 'address':
          navigator.replace('address', getAddressNavigatorParams(searchResults[0]));
          break;
        case 'unit':
          navigator.replace('unit', { id });
          break;
        case 'service':
          navigator.replace('service', id);
          break;
        default:
      }
    }
    return null;
  };

  useEffect(() => {
    const options = getSearchParamData();
    if (shouldFetch() && Object.keys(options).length) {
      dispatch(fetchSearchResults(options));
    }
  }, [match.params]);


  useEffect(() => {
    if (searchResults.length) {
      if (searchResults.length === 1) {
        handleSingleResultRedirect();
      } else {
      // Focus map to new search results units
        const units = getResultsByType('unit');
        if (units.length) focusMap(units);
      }
    } else {
      // Send analytics report if search query did not return results
      const { previousSearch, isFetching } = searchFetchState;
      if (navigator && previousSearch && !isFetching && analyticsSent !== previousSearch) {
        setAnalyticsSent(previousSearch);
        navigator.trackPageView(null, previousSearch);
      }
    }
  }, [JSON.stringify(searchResults)]);

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
          tabIndex={-1}
          onClick={() => skipToContent()}
          onKeyPress={() => {
            keyboardHandler(() => skipToContent(), ['space', 'enter']);
          }}
          style={visuallyHidden}
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
        <Typography style={visuallyHidden} component="h3" tabIndex={-1}>
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


  if (embed) {
    return null;
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
        <Typography style={visuallyHidden} component="h3">
          <Link href={`#${viewTitleID}`} tabIndex={-1}>
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
};
