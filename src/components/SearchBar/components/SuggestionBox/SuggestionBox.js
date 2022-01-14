import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { ArrowDropUp, LocationOn, Search } from '@material-ui/icons';
import {
  Paper, List, Typography,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { getPreviousSearches } from '../../previousSearchData';
import PreviousSearches from '../../PreviousSearches';
import createSuggestions from '../../createSuggestions';
import config from '../../../../../config';
import SuggestionItem from '../../../ListItems/SuggestionItem';
import { keyboardHandler } from '../../../../utils';
import { AreaIcon } from '../../../SMIcon';
import { CloseSuggestionButton } from '../CloseSuggestionButton';
import { setSelectedDistrictType } from '../../../../redux/actions/district';


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
    locale,
    navigator,
  } = props;

  const [searchQueries, setSearchQueries] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState(false);
  // Query word on which suggestion list is based
  const [suggestionQuery, setSuggestionQuery] = useState(null);

  const dispatch = useDispatch();
  const listRef = useRef(null);
  const fetchController = useRef(null);
  const maxSuggestionCount = 5;

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

  const handleAreaItemClick = (area) => {
    if (navigator) {
      dispatch(setSelectedDistrictType(null));
      navigator.push('area', area.id);
    }
  };

  const handleAddressItemClick = (item) => {
    handleBlur();
    navigator.push('search', { q: item.query, t: 1 });
  };

  const slicedSuggestions = () => {
    let suggestionList = searchQueries || null;
    if (suggestionList && suggestionList.length) {
      suggestionList = suggestionList.slice(0, maxSuggestionCount);
    }
    return suggestionList;
  };

  const resetSuggestions = () => {
    setSearchQueries(null);
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
      const { signal } = fetchController.current;

      createSuggestions(query, signal, locale, intl)
        .then((suggestions) => {
          if (suggestions === 'error') {
            return;
          }
          fetchController.current = null;
          if (suggestions.length) {
            setSearchQueries(suggestions);
            setLoading(false);
          } else {
            setSuggestionError(true);
            setLoading(false);
          }
        });
    } else {
      setLoading(false);
      setSearchQueries(null);
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

  const renderSuggestionList = () => {
    const suggestionList = slicedSuggestions();

    if (suggestionList) {
      return (
        <>
          <List role="listbox" id="SuggestionList" className="suggestionList" ref={listRef}>
            {suggestionList.map((item, i) => {
              if (item.object_type === 'suggestion') {
                return (
                  <SuggestionItem
                    id={`suggestion${i}`}
                    role="option"
                    selected={i === focusedSuggestion}
                    key={`suggestion-${item.suggestion + item.count}`}
                    icon={<Search />}
                    text={item.suggestion}
                    handleArrowClick={handleArrowClick}
                    handleItemClick={() => handleSubmit(item.suggestion)}
                    divider={i !== suggestionList.length - 1}
                    subtitle={intl.formatMessage({ id: 'search.suggestions.results' }, { count: item.count })}
                    isMobile
                    query={suggestionQuery}
                  />
                );
              }
              if (item.object_type === 'area') {
                return (
                  <SuggestionItem
                    id={`suggestion${i}`}
                    className="AreaSuggestion"
                    role="option"
                    selected={i === focusedSuggestion}
                    key={`suggestion-${item.name}`}
                    icon={<AreaIcon className={classes.areaIcon} />}
                    text={`${item.name}, ${intl.formatMessage({ id: 'search.suggestions.areas' })}`}
                    handleItemClick={() => handleAreaItemClick(item)}
                    divider
                    isMobile
                    query={suggestionQuery}
                  />
                );
              }
              if (item.object_type === 'address') {
                const sortIndex = item.sort_index;
                return (
                  <SuggestionItem
                    id={`suggestion${i}`}
                    className="AddressSuggestion"
                    role="option"
                    selected={i === focusedSuggestion}
                    key={`address-${sortIndex}`}
                    icon={<LocationOn className={classes.areaIcon} />}
                    text={item.name}
                    handleItemClick={() => handleAddressItemClick(item)}
                    divider
                    isMobile
                    query={suggestionQuery}
                    fullQuery={item.query}
                  />
                );
              }
              return null;
            })}
          </List>
        </>
      );
    } return null;
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
    if (searchQueries) {
      component = renderSuggestionList();
      const suggestionList = slicedSuggestions();
      srText = intl.formatMessage({ id: 'search.suggestions.suggestions' }, { count: suggestionList.length });
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
  locale: PropTypes.oneOf(config.supportedLanguages).isRequired,
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
