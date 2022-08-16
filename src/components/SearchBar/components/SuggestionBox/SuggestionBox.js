import React, {
  useEffect, useState, useRef, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { ArrowDropUp, LocationOn } from '@material-ui/icons';
import {
  Paper, List, Typography,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import PreviousSearches from '../../PreviousSearches';
import createSuggestions from '../../createSuggestions';
import SuggestionItem from '../../../ListItems/SuggestionItem';
import { keyboardHandler } from '../../../../utils';
import { getIcon } from '../../../SMIcon';
import { CloseSuggestionButton } from '../CloseSuggestionButton';
import useLocaleText from '../../../../utils/useLocaleText';
import UnitIcon from '../../../SMIcon/UnitIcon';
import setSearchBarInitialValue from '../../../../redux/actions/searchBar';
import { useNavigationParams } from '../../../../utils/address';
import config from '../../../../../config';

const suggestionCount = 8;

const SuggestionBox = (props) => {
  const {
    closeMobileSuggestions,
    visible,
    searchQuery,
    handleArrowClick,
    handleSubmit,
    handleBlur,
    classes,
    focusedSuggestion,
    isMobile,
    intl,
    navigator,
  } = props;

  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState(false);
  // Query word on which suggestion list is based
  const [suggestionQuery, setSuggestionQuery] = useState(null);

  const getAddressNavigatorParams = useNavigationParams();
  const dispatch = useDispatch();
  const getLocaleText = useLocaleText();
  const listRef = useRef(null);
  const fetchController = useRef(null);

  const locale = useSelector(state => state.user.locale);
  const citySettings = useSelector((state) => {
    const { cities } = state.settings;
    return config.cities.filter(c => cities[c]);
  });

  // const handleAreaItemClick = (area) => {
  //   if (navigator) {
  //     dispatch(setSelectedDistrictType(null));
  //     navigator.push('area', area.id);
  //   }
  // };

  const getAddressText = (item) => {
    if (item.isExact) {
      return getLocaleText(item.name);
    }
    return `${getLocaleText(item.street?.name)}, ${intl.formatMessage({ id: 'search.suggestions.addresses' })}`;
  };

  const handleAddressItemClick = useCallback((item) => {
    if (item.isExact) {
      navigator.push('address', getAddressNavigatorParams(item));
    } else {
      navigator.push('search', { q: getLocaleText(item.street?.name), t: 'addresses' });
    }
    handleBlur();
  }, [handleBlur, navigator, getLocaleText]);


  // Component mount action
  useEffect(() => (
    // Component unmount actions
    () => {
      if (fetchController && fetchController.current) {
        fetchController.current.abort();
      }
    }), []);

  /* TODO: Utilize city information with search queries
  let cities = []
  config.cities.forEach((city) => {
    cities.push( ...settings[city] ? [city] : []);
  });
  */

  const resetSuggestions = () => {
    setSuggestions(null);
    setSuggestionError(false);
  };

  const generateSuggestions = (query) => {
    resetSuggestions();

    if (query && query.length > 1) {
      setLoading('suggestions');

      if (fetchController.current) {
        fetchController.current.abort();
      }
      fetchController.current = new AbortController();

      dispatch(createSuggestions(
        query,
        fetchController.current,
        getLocaleText,
        citySettings,
        locale,
      ))
        .then((data) => {
          if (data === 'error') {
            return;
          }
          fetchController.current = null;
          setLoading(false);
          if (data.length) {
            setSuggestions(data);
          } else {
            setSuggestionError(true);
          }
        }).catch(() => {
          // Do nothing
        });
    } else {
      setLoading(false);
      setSuggestions(null);
      if (fetchController.current) {
        fetchController.current.abort();
      }
    }
  };

  const renderSearchHistory = () => (
    <>
      <PreviousSearches
        className={classes.infoText}
        handleArrowClick={handleArrowClick}
        focusIndex={focusedSuggestion}
        listRef={listRef}
        onClick={val => handleSubmit(val)}
      />
    </>
  );

  const renderNoResults = () => (
    <>
      <Typography align="left" className={classes.infoText}>
        <FormattedMessage id="search.suggestions.error" />
      </Typography>
    </>
  );

  const renderLoading = () => (
    <>
      <Typography align="left" className={classes.infoText}>
        <FormattedMessage id="search.suggestions.loading" />
      </Typography>
    </>
  );

  const renderSuggestionList = (suggestionList) => {
    const suggestionConfig = {
      address: {
        icon: <LocationOn className={classes.areaIcon} />,
        onClick: item => handleAddressItemClick(item),
        text: item => getAddressText(item),
      },
      unit: {
        icon: <UnitIcon />,
        onClick: item => navigator.push('unit', { id: item.id }),
        text: item => getLocaleText(item.name),
      },
      service: {
        icon: getIcon('serviceDark'),
        onClick: (item) => {
          handleBlur();
          navigator.push('search', { serviceId: item.id });
        },
        text: item => getLocaleText(item.name),
      },
      servicenode: {
        icon: getIcon('serviceDark'),
        onClick: (item) => {
          handleBlur();
          navigator.push('search', { service_node: item.ids.join(',') });
        },
        text: item => getLocaleText(item.name),
      },
    };

    // Order suggestion types and slice list
    const addresses = suggestionList.filter(item => item.object_type === 'address');
    const units = suggestionList.filter(item => item.object_type === 'unit');
    const services = suggestionList.filter(item => item.object_type === 'service');
    const servicenodes = suggestionList.filter(item => item.object_type === 'servicenode');

    const orderedSuggestions = [
      ...addresses,
      ...servicenodes,
      ...services,
      ...units,
    ].slice(0, suggestionCount);

    return (
      <List role="listbox" id="SuggestionList" className="suggestionList" ref={listRef}>
        {orderedSuggestions.map((suggestion, i) => {
          const conf = suggestionConfig[suggestion.object_type];
          if (!conf) return null;
          const text = conf.text(suggestion);

          return (
            <SuggestionItem
              id={`suggestion${i}`}
              key={suggestion.id || suggestion.name.fi}
              className={conf.className ? 'AddressSuggestion' : ''}
              role="option"
              selected={i === focusedSuggestion}
              icon={conf.icon}
              text={text}
              handleItemClick={() => {
                const searchValue = suggestion.object_type === 'address' && !suggestion.isExact
                  ? getLocaleText(suggestion.street.name)
                  : text;
                dispatch(setSearchBarInitialValue(searchValue));
                conf.onClick(suggestion);
              }}
              divider
              isMobile
              query={suggestionQuery}
            />
          );
        })}
      </List>
    );
  };

  const renderHideSuggestions = () => {
    if (!closeMobileSuggestions) {
      return null;
    }

    return (
      <CloseSuggestionButton
        className={classes.minimizeLink}
        onClick={(e) => {
          e.preventDefault();
          closeMobileSuggestions();
        }}
        onKeyDown={(e) => {
          e.preventDefault();
          keyboardHandler(closeMobileSuggestions, ['space', 'enter'])(e);
        }}
        icon={<ArrowDropUp />}
      />
    );
  };

  /**
  * Component updaters
  */
  useEffect(() => { // Start generating suggestions when typing in searchbar
    if (!searchQuery) {
      setSuggestionQuery(null);
      resetSuggestions();
    }
    if (searchQuery) {
      setSuggestionQuery(searchQuery);
      generateSuggestions(searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    // Disable page scroll when suggestion box is open
    const sidebar = document.getElementsByClassName('SidebarWrapper')[0];
    const app = document.getElementsByClassName('App')[0];
    if (visible) {
      if (isMobile) {
        sidebar.style.overflow = 'hidden';
      }
      if (app) {
        app.style.height = '100%';
      }
    }

    return () => {
      sidebar.style.overflow = isMobile ? 'visible' : 'auto';
      if (app) {
        app.style.height = null;
      }
    };
  }, [visible]);

  /**
  * Render component
  */
  if (visible) {
    let component = null;
    let srText = null;
    if (suggestions) {
      component = renderSuggestionList(suggestions);
      srText = intl.formatMessage({ id: 'search.suggestions.suggestions' }, { count: suggestions.length });
    } else if (loading) {
      component = renderLoading();
      srText = null;
    } else if (suggestionError) {
      component = renderNoResults();
      srText = intl.formatMessage({ id: 'search.suggestions.error' });
    } else {
      component = renderSearchHistory();
    }

    const containerStyles = isMobile
      ? `${classes.suggestionAreaMobile}`
      : `${classes.suggestionArea}`;

    return (
      <>
        <Paper elevation={20} className={containerStyles}>
          <p className="sr-only" aria-live="polite">{srText}</p>
          {
            renderHideSuggestions()
          }
          {component}
        </Paper>
      </>
    );
  }
  return <></>;
};

SuggestionBox.propTypes = {
  closeMobileSuggestions: PropTypes.func,
  visible: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  searchQuery: PropTypes.string,
  handleArrowClick: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  focusedSuggestion: PropTypes.number,
  navigator: PropTypes.objectOf(PropTypes.any),
  isMobile: PropTypes.bool,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

SuggestionBox.defaultProps = {
  closeMobileSuggestions: null,
  navigator: null,
  visible: false,
  searchQuery: null,
  focusedSuggestion: null,
  isMobile: false,
};

export default SuggestionBox;
