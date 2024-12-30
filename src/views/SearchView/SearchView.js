/* eslint-disable camelcase */

import styled from '@emotion/styled';
import {
  Divider, Link, NoSsr, Paper, Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useRouteMatch } from 'react-router-dom';
import {
  AddressSearchBar, Container, Loading, SearchBar, SettingsComponent, TabLists,
} from '../../components';
import fetchSearchResults from '../../redux/actions/search';
import {
  activateSetting, resetAccessibilitySettings, setCities, setMapType, setOrganizations,
} from '../../redux/actions/settings';
import { changeCustomUserLocation, resetCustomPosition } from '../../redux/actions/user';
import { selectBounds, selectMapRef, selectNavigator } from '../../redux/selectors/general';
import { getOrderedSearchResultData, selectResultsData, selectSearchResults } from '../../redux/selectors/results';
import {
  // eslint-disable-next-line max-len
  selectMapType, selectSelectedAccessibilitySettings, selectSelectedCities, selectSelectedOrganizationIds,
} from '../../redux/selectors/settings';
import { selectCustomPositionAddress } from '../../redux/selectors/user';
import { keyboardHandler, parseSearchParams } from '../../utils';
import { viewTitleID } from '../../utils/accessibility';
import { getAddressNavigatorParamsConnector, useNavigationParams } from '../../utils/address';
import { applyCityAndOrganizationFilter } from '../../utils/filters';
import useMobileStatus from '../../utils/isMobile';
import { getBboxFromBounds, parseBboxFromLocation } from '../../utils/mapUtility';
import { isEmbed } from '../../utils/path';
import optionsToSearchQuery from '../../utils/search';
import SettingsUtility from '../../utils/settings';
import fetchAddressData from '../AddressView/utils/fetchAddressData';
import { fitUnitsToMap } from '../MapView/utils/mapActions';
import useMatomo from '../../components/Matomo/hooks/useMatomo';
import config from '../../../config';

const focusClass = 'TabListFocusTarget';

function SearchView() {
  const [analyticsSent, setAnalyticsSent] = useState(null);
  const orderedData = useSelector(getOrderedSearchResultData);
  const unorderedSearchResults = useSelector(selectResultsData);
  const searchFetchState = useSelector(selectSearchResults);
  const isRedirectFetching = useSelector(state => state.redirectService.isFetching);
  const selectedCities = useSelector(selectSelectedCities);
  const selectedOrganizationIds = useSelector(selectSelectedOrganizationIds);
  const selectedAccessibilitySettings = useSelector(selectSelectedAccessibilitySettings);
  const bounds = useSelector(selectBounds);
  const customPositionAddress = useSelector(selectCustomPositionAddress);
  const map = useSelector(selectMapRef);
  const navigator = useSelector(selectNavigator);
  const mapType = useSelector(selectMapType);

  const getAddressNavigatorParams = useNavigationParams();
  const dispatch = useDispatch();
  const embed = isEmbed();
  const isMobile = useMobileStatus();
  const location = useLocation();
  const match = useRouteMatch();
  const intl = useIntl();
  const { trackPageView } = useMatomo();

  const searchResults = applyCityAndOrganizationFilter(orderedData, location, embed);

  const getResultsByType = type => searchResults.filter(item => item.object_type === type);

  const stringifySearchQuery = data => {
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

  const getSearchParamData = () => {
    const searchParams = parseSearchParams(location.search);

    const {
      q,
      category,
      address,
      service_id,
      service_node,
      mobility_node,
      search_language,
      events,
      units,
    } = searchParams;

    const options = {};
    if (q) {
      options.q = q;
    } else {
      // Parse address search parameter
      if (address) {
        options.address = address;
      }

      // Parse service units
      if (service_id) {
        options.service_id = service_id;
      }

      // Parse service_node
      if (mobility_node) {
        options.mobility_node = mobility_node;
      }
      if (service_node) {
        options.service_node = service_node;
      }

      if (events) {
        options.events = events;
      }

      // This is used when embedding a specified list of units by IDs
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
    // Parse search language
    if (search_language) {
      options.search_language = search_language;
    }

    return options;
  };

  function fetchSearchResultsWithoutNumber(searchQuery) {
    // Check if search query ends with number and fetch data without it.
    // This is for searching addresses with street number in case of no results.
    if (searchQuery && searchQuery.match(/\d$/)) {
      const newSearchQuery = searchQuery.replace(/\d+$/, '');
      if (newSearchQuery && newSearchQuery !== searchQuery) {
        dispatch(fetchSearchResults({ q: newSearchQuery }));
      }
    }
  }

  // Check if view will fetch data because sreach params has changed
  const shouldFetch = () => {
    const { isFetching, previousSearch } = searchFetchState;
    if (isFetching || isRedirectFetching) {
      return false;
    }
    const data = getSearchParamData();
    const searchQuery = optionsToSearchQuery(data);

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

  const handleUserAddressChange = address => {
    if (address) {
      dispatch(changeCustomUserLocation(
        [address.location.coordinates[1], address.location.coordinates[0]],
        address,
      ));
    } else {
      dispatch(resetCustomPosition());
    }
  };

  function handleAccessibilityParams(accessibility_setting) {
    const accessibilityOptions = accessibility_setting?.split(',');
    if (accessibilityOptions?.length) {
      dispatch(resetAccessibilitySettings());
      const mobility = accessibilityOptions.filter(x => SettingsUtility.isValidMobilitySetting(x));
      if (mobility.length === 1) {
        dispatch(activateSetting('mobility', mobility[0]));
      }
      accessibilityOptions
        .map(x => SettingsUtility.mapValidAccessibilitySenseImpairmentValueToKey(x))
        .filter(x => !!x)
        .forEach(x => {
          dispatch(activateSetting(x));
        });
    }
  }

  function handleCityAndOrganisationSettings(municipality, city, organization) {
    const cityOptions = (municipality || city)?.split(',');
    if (cityOptions?.length) {
      dispatch(setCities(cityOptions));
    }
    const orgOptions = organization?.split(',');
    if (orgOptions?.length) {
      dispatch(setOrganizations(orgOptions));
    }
  }

  async function handleAddressParam(hcity, hstreet) {
    if (hcity && hstreet) {
      fetchAddressData(hcity, hstreet.replace('+', ' '))
        .then(address => {
          if (address?.length) {
            handleUserAddressChange(address[0]);
          }
        });
    }
  }

  function reorderBbox(bbox) {
    if (bbox.length !== 4) {
      throw new Error('Invalid bbox length. Expected an array of 4 elements.');
    }
    // Reorder the bbox coordinates to match the order that the API requires
    return [bbox[1], bbox[0], bbox[3], bbox[2]];
  }

  useEffect(() => {
    if (embed) {
      // Do not mess with settings when embedded
      return;
    }
    const searchParams = parseSearchParams(location.search);
    const {
      city,
      organization,
      municipality,
      accessibility_setting,
      hcity,
      hstreet,
      map,
    } = searchParams;
    if (map?.length && map !== mapType) {
      const mapTypeParam = map === 'guideMap' ? 'guidemap' : map; // keep alive old links with "guideMap"
      dispatch(setMapType(mapTypeParam));
    }
    handleCityAndOrganisationSettings(municipality, city, organization);
    handleAccessibilityParams(accessibility_setting);
    handleAddressParam(hcity, hstreet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const options = getSearchParamData();
    if (shouldFetch() && Object.keys(options).length) {
      const bbox = parseBboxFromLocation(location);
      if (embed && bbox) {
        // Filter search results by bbox if embedded and bbox is provided
        const reorderedBbox = reorderBbox(bbox);
        options.bbox = reorderedBbox;
        options.bbox_srid = 4326;
      }
      dispatch(fetchSearchResults(options));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params]);

  useEffect(() => {
    if (searchResults.length) {
      if (parseBboxFromLocation(location)) {
        // MapView component will handle focus.
        return;
      }
      if (searchResults.length === 1) {
        handleSingleResultRedirect();
        // Focus map to new search results units
        return;
      }
      const units = getResultsByType('unit');
      if (units.length && map?.options.maxZoom) {
        fitUnitsToMap(units, map);
      }
    } else {
      const { previousSearch, isFetching } = searchFetchState;
      const options = getSearchParamData();
      if (options.q && previousSearch && !isFetching) {
        // If no results found, try to fetch results without number
        fetchSearchResultsWithoutNumber(previousSearch);
      }
      // Send analytics report if search query did not return results
      if (
        navigator
        && previousSearch
        && !isFetching
        && analyticsSent !== previousSearch
      ) {
        setAnalyticsSent(previousSearch);

        if (!isEmbed()) {
          trackPageView({
            href: window.location.href,
            ...config.matomoMobilityDimensionID && (
              { id: config.matomoNoResultsDimensionID, value: previousSearch }
            ),
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(unorderedSearchResults), searchResults]);

  useEffect(
    () => {
      if (embed || !navigator) {
        return;
      }
      navigator.setParameter('city', selectedCities);
      navigator.setParameter('organization', selectedOrganizationIds);
      navigator.setParameter('accessibility_setting', selectedAccessibilitySettings);
      if (bounds) {
        navigator.setParameter('bbox', getBboxFromBounds(bounds));
      }
      if (customPositionAddress) {
        const { municipality, name } = getAddressNavigatorParamsConnector(customPositionAddress);
        navigator.setParameter('hcity', municipality);
        navigator.setParameter('hstreet', name);
      } else {
        navigator.removeParameter('hcity');
        navigator.removeParameter('hstreet');
      }
      navigator.setParameter('map', mapType);
    },
    [
      navigator, embed, selectedCities, selectedOrganizationIds, selectedAccessibilitySettings,
      bounds, customPositionAddress, mapType,
    ],
  );

  const renderSearchBar = () => (
    <StyledSearchBar expand />
  );

  const renderSearchInfo = () => (
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
    </NoSsr>
  );

  const renderScreenReaderInfo = () => {
    const { isFetching, max } = searchFetchState;
    return (
      <StyledPaper nopadding={+!isFetching} elevation={1} square aria-live="polite">
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
      </StyledPaper>
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
    // This was same as previousSearch, but the text was not user-friendly when searching by nodes.
    const options = parseSearchParams(location.search);
    delete options.mobility_node;
    delete options.service_node;
    const searchQuery = optionsToSearchQuery(options);

    return shouldRender ? (
      <StyledNoVerticalPaddingContainer>
        <StyledNoVerticalPaddingContainer>
          <Typography align="left" variant="subtitle1" component="p">
            <FormattedMessage id={typeof searchQuery === 'string' ? 'search.notFoundWith' : 'search.notFound'} values={{ query: searchQuery }} />
          </Typography>
        </StyledNoVerticalPaddingContainer>
        <Divider aria-hidden="true" />
        <StyledNoVerticalPaddingContainer>
          <Typography align="left" variant="subtitle1" component="p">
            <FormattedMessage id="search.tryAgain" />
          </Typography>
          <StyledList>
            {
              messageIDs.map(id => (
                <li key={id}>
                  <Typography align="left" variant="body2" component="p">
                    <FormattedMessage id={`search.tryAgainBody.${id}`} />
                  </Typography>
                </li>
              ))
            }
          </StyledList>
        </StyledNoVerticalPaddingContainer>
      </StyledNoVerticalPaddingContainer>
    ) : null;
  };

  if (embed) {
    return null;
  }

  return (
    <StyledContainer>
      {renderSearchBar()}
      {renderSearchInfo()}
      <NoSsr>
        <AddressSearchBar title={<FormattedMessage id="area.searchbar.infoText.address" />} handleAddressChange={handleUserAddressChange} />
        <SettingsComponent />
      </NoSsr>
      {renderScreenReaderInfo()}
      {searchFetchState.isFetching ? (
        <Loading reducer={searchFetchState} />
      ) : renderResults()}
      {renderNotFound()}
      {isMobile ? (
        // Jump link back to beginning of current page
        <Typography style={visuallyHidden} component="h3">
          <Link href={`#${viewTitleID}`} tabIndex={-1}>
            <FormattedMessage id="general.return.viewTitle" />
          </Link>
        </Typography>
      ) : null}
    </StyledContainer>
  );
}

export default SearchView;

// Typechecking
const StyledNoVerticalPaddingContainer = styled(Container)(() => ({
  paddingTop: 0,
  paddingBottom: 0,
}));

const StyledPaper = styled(Paper)(({ nopadding }) => (nopadding ? { padding: 0 } : {}));
const StyledSearchBar = styled(SearchBar)(({ theme }) => ({
  background: theme.palette.primary.main,
  paddingBottom: theme.spacing(1),
}));
const StyledList = styled.ul(({ theme }) => ({
  margin: theme.spacing(1, 0),
  padding: theme.spacing(0, 0, 0, 2),
}));

const StyledContainer = styled.div(() => ({
  display: 'inline-block',
  position: 'relative',
  width: '100%',
}));
