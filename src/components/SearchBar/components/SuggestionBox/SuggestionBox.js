import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  AccessTime, ArrowDropUp, LocationOn, Search,
} from '@mui/icons-material';
import {
  Paper, List, Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import createSuggestions from '../../createSuggestions';
import SuggestionItem from '../../../ListItems/SuggestionItem';
import { keyboardHandler, uppercaseFirst } from '../../../../utils';
import { getIcon } from '../../../SMIcon';
import { CloseSuggestionButton } from '../CloseSuggestionButton';
import useLocaleText from '../../../../utils/useLocaleText';
import UnitIcon from '../../../SMIcon/UnitIcon';
import config from '../../../../../config';
import { getPreviousSearches, removeSearchFromHistory, saveSearchToHistory } from '../../previousSearchData';
import { useNavigationParams } from '../../../../utils/address';

const suggestionCount = 8;

const SuggestionBox = (props) => {
  const {
    closeMobileSuggestions,
    visible,
    searchQuery,
    handleSubmit,
    handleBlur,
    classes,
    focusedSuggestion,
    isMobile,
    intl,
    navigator,
  } = props;

  const [suggestions, setSuggestions] = useState(null);
  const [history, setHistory] = useState(getPreviousSearches());
  const [loading, setLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState(false);
  // Query word on which suggestion list is based
  const [suggestionQuery, setSuggestionQuery] = useState(null);

  const dispatch = useDispatch();
  const getLocaleText = useLocaleText();
  const getAddressNavigatorParams = useNavigationParams();
  const listRef = useRef(null);
  const fetchController = useRef(null);

  const citySettings = useSelector((state) => {
    const { cities } = state.settings;
    return config.cities.filter(c => cities[c]);
  });

  const getAddressText = (item) => {
    if (item.isExact) {
      return `${getLocaleText(item.name)}, ${getLocaleText(item.municipality.name)}`;
    }
    return `${getLocaleText(item.name)}, ${intl.formatMessage({ id: 'search.suggestions.addresses' })}`;
  };


  // Component mount action
  useEffect(() => (
    // Component unmount actions
    () => {
      if (fetchController && fetchController.current) {
        fetchController.current.abort();
      }
    }), []);


  const resetSuggestions = () => {
    setSuggestions(null);
    setSuggestionError(false);
  };

  const handleRemovePrevious = (suggestion) => {
    const callback = () => setHistory(getPreviousSearches());
    removeSearchFromHistory(suggestion, callback);
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

  const renderSuggestionList = (type = 'suggestion') => {
    const suggestionConfig = {
      address: {
        text: item => getAddressText(item),
        icon: item => (item.isExact ? <LocationOn /> : <Search />),
        onClick: (item) => {
          handleBlur();
          saveSearchToHistory(getAddressText(item), item);
          if (item.isExact) {
            navigator.push('address', getAddressNavigatorParams(item));
          } else {
            navigator.push('search', { address: getLocaleText(item.name) });
          }
        },
      },
      unit: {
        text: item => getLocaleText(item.name),
        icon: () => <UnitIcon />,
        onClick: (item) => {
          saveSearchToHistory(getLocaleText(item.name), item);
          navigator.push('unit', { id: item.id });
        },
      },
      service: {
        text: item => getLocaleText(item.name),
        icon: () => getIcon('serviceDark'),
        onClick: (item) => {
          handleBlur();
          saveSearchToHistory(getLocaleText(item.name), item);
          navigator.push('search', { service_id: item.id });
        },
      },
      servicenode: {
        text: item => getLocaleText(item.name),
        icon: () => getIcon('serviceDark'),
        onClick: (item) => {
          handleBlur();
          saveSearchToHistory(getLocaleText(item.name), item);
          navigator.push('search', { service_node: item.ids.join(',') });
        },
      },
      searchHistory: {
        text: item => item.text,
        icon: () => <AccessTime />,
        onClick: (item) => {
          handleBlur();
          handleSubmit(item.text);
        },
      },
    };

    let listId;
    let suggestionList = [];

    // Define if component should show search history or search suggestions
    if (type === 'history') {
      listId = 'PreviousList';
      suggestionList = history;
    } else {
      listId = 'SuggestionList';
      // Order suggestion types and slice list
      const addresses = suggestions.filter(item => item.object_type === 'address');
      const units = suggestions.filter(item => item.object_type === 'unit');
      const services = suggestions.filter(item => item.object_type === 'service');
      const servicenodes = suggestions.filter(item => item.object_type === 'servicenode');

      const orderedSuggestions = [
        ...addresses,
        ...servicenodes,
        ...services,
        ...units,
      ].slice(0, suggestionCount);

      suggestionList = orderedSuggestions;
    }

    // If no searches in search history, display info text
    if (type === 'history' && !suggestionList?.length) {
      return (
        <Typography align="left" aria-live="polite" className={classes.infoText}>
          <FormattedMessage id="search.suggestions.noHistory" />
        </Typography>
      );
    }

    return (
      <List role="listbox" id={listId} className="suggestionList" ref={listRef}>
        {suggestionList.map((suggestion, i) => {
          const conf = suggestionConfig[suggestion.object_type];
          if (!conf) return null;
          const text = conf.text(suggestion);

          return (
            <SuggestionItem
              id={`suggestion${i}`}
              key={suggestion.id || text}
              role="option"
              selected={i === focusedSuggestion}
              icon={conf.icon(suggestion)}
              text={uppercaseFirst(text)}
              handleItemClick={() => conf.onClick(suggestion)}
              handleRemoveClick={type === 'history'
                ? () => handleRemovePrevious(suggestion)
                : null
              }
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
      component = renderSuggestionList('suggestion');
      srText = intl.formatMessage({ id: 'search.suggestions.suggestions' }, { count: suggestions.length });
    } else if (loading) {
      component = renderLoading();
      srText = null;
    } else if (suggestionError) {
      component = renderNoResults();
      srText = intl.formatMessage({ id: 'search.suggestions.error' });
    } else {
      component = renderSuggestionList('history');
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
