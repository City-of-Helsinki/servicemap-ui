import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Search } from '@material-ui/icons';
import {
  Paper, List, Typography,
} from '@material-ui/core';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import { FormattedMessage, intlShape } from 'react-intl';
import { getPreviousSearches } from '../../previousSearchData';
import PreviousSearches from '../../PreviousSearches';
import createSuggestions from '../../createSuggestions';
import config from '../../../../../config';
import SuggestionItem from '../../../ListItems/SuggestionItem';


const SuggestionBox = (props) => {
  const {
    visible,
    searchQuery,
    handleSubmit,
    classes,
    focusedSuggestion,
    setSearch,
    intl,
  } = props;

  const [searchQueries, setSearchQueries] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState(false);
  const [history] = useState(getPreviousSearches());
  // Query word on which suggestion list is based
  const [suggestionQuery, setSuggestionQuery] = useState(null);
  const isMobile = useMediaQuery(`(max-width:${config.mobileUiBreakpoint}px)`);

  const listRef = useRef(null);
  const fetchController = useRef(null);
  const maxSuggestionCount = 8;

  /* TODO: Utilize city information with search queries
  const cities = [
    ...settings.helsinki ? ['Helsinki'] : [],
    ...settings.espoo ? ['Espoo'] : [],
    ...settings.vantaa ? ['Vantaa'] : [],
    ...settings.kauniainen ? ['Kauniainen'] : [],
  ];
  */

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

    if (query && query.length > 2) {
      setLoading('suggestions');

      if (fetchController.current) {
        fetchController.current.abort();
      }
      fetchController.current = new AbortController();
      const { signal } = fetchController.current;

      createSuggestions(query, signal)
        .then((result) => {
          if (result !== 'error') {
            fetchController.current = null;
            if (result.suggestions.length) {
              setSearchQueries(result.suggestions);
              setLoading(false);
            } else {
              setSuggestionError(true);
              setLoading(false);
            }
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

  const setSearchBarText = () => {
    if (listRef && listRef.current) {
      if (listRef.current.props.children.length && focusedSuggestion !== null) {
        if (searchQueries) {
          setSearch(searchQueries[focusedSuggestion].suggestion);
        } else if (history) {
          setSearch(history[focusedSuggestion]);
        }
      }
    }
  };

  const renderSearchHistory = () => (
    <>
      <PreviousSearches
        handleArrowClick={suggestion => setSearch(suggestion)}
        history={history}
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
    const handleArrowClick = setSearch ? suggestion => setSearch(suggestion) : null;

    if (suggestionList) {
      return (
        <>
          <List className="suggestionList" ref={listRef}>
            {suggestionList.map((item, i) => (
              <SuggestionItem
                selected={i === focusedSuggestion}
                button
                key={item.suggestion + item.count}
                icon={<Search />}
                role="link"
                text={item.suggestion}
                handleArrowClick={handleArrowClick}
                handleItemClick={() => handleSubmit(item.suggestion)}
                divider={i !== suggestionList.length - 1}
                subtitle={intl.formatMessage({ id: 'search.suggestions.results' }, { count: item.count })}
                isMobile
                query={suggestionQuery}
              />
            ))}
          </List>
        </>
      );
    } return null;
  };

  /**
  * Component updaters
  */
  useEffect(() => { // Start generating suggestions when typing in searchbar
    if (!searchQuery) {
      setSuggestionQuery(null);
      resetSuggestions();
    }
    if (searchQuery && focusedSuggestion === null) {
      setSuggestionQuery(searchQuery);
      generateSuggestions(searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => { // Change text of the searchbar when suggestion with keyboard focus changes
    setSearchBarText();
  }, [focusedSuggestion]);

  useEffect(() => {
    // Disable page scroll when suggestion box is open
    const sidebar = document.getElementsByClassName('SidebarWrapper')[0];
    const app = document.getElementsByClassName('App')[0];
    if (visible) {
      sidebar.style.overflow = isMobile ? 'hidden' : 'hidden';
      if (app) {
        app.style.height = '100%';
      }
    }

    return () => {
      sidebar.style.overflow = isMobile ? '' : 'auto';
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
          {component}
        </Paper>
      </>
    );
  }
  return <></>;
};

SuggestionBox.propTypes = {
  visible: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  searchQuery: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  focusedSuggestion: PropTypes.number,
  setSearch: PropTypes.func,
  intl: intlShape.isRequired,
};

SuggestionBox.defaultProps = {
  visible: false,
  searchQuery: null,
  focusedSuggestion: null,
  setSearch: null,
};

export default SuggestionBox;
