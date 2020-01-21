import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Search, ArrowBack } from '@material-ui/icons';
import {
  Paper, List, Typography, IconButton,
} from '@material-ui/core';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import { FormattedMessage, intlShape } from 'react-intl';
import { getPreviousSearches } from '../SearchBar/previousSearchData';
import createSuggestions from '../SearchBar/createSuggestions';
import config from '../../../config';
import SMButton from '../ServiceMapButton';
import SuggestionItem from '../ListItems/SuggestionItem';
import { parseSearchParams } from '../../utils';


const ExpandedSuggestions = (props) => {
  const {
    searchQuery,
    classes,
    focusedSuggestion,
    setSearch,
    intl,
    location,
    navigator,
  } = props;
  const expandSearchVisible = () => {
    const searchParams = parseSearchParams(location.search);

    return !!(searchParams.expand && searchParams.expand === '1');
  };

  const [searchQueries, setSearchQueries] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState(false);
  const [history] = useState(getPreviousSearches());
  // Query word on which suggestion list is based
  const [suggestionQuery, setSuggestionQuery] = useState(null);
  const [visible, setVisible] = useState(expandSearchVisible());
  const isMobile = useMediaQuery(`(max-width:${config.mobileUiBreakpoint}px)`);

  const listRef = useRef(null);
  const fetchController = useRef(null);
  // const titleRef = useRef(null);

  useEffect(() => {
    if (!visible) {
      return;
    }
    const title = document.getElementsByClassName('ExpandedSuggestions-title')[0];
    if (title) {
      title.focus();
    }
  }, [visible]);

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

      createSuggestions(query, signal)
        .then((result) => {
          if (result !== 'error') {
            fetchController.current = null;
            if (result.suggestions.length) {
              setSearchQueries(result.suggestions);
              setLoading(false);
            } else {
              setSearchQueries([]);
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

  const suggestionClick = (query) => {
    if (query && query !== '' && navigator) {
      navigator.push('search', { q: query });
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

  const setVisibility = (visibility = null) => {
    const searchParams = parseSearchParams(location.search);
    const newVisibility = visibility !== null ? visibility : !visible;

    setVisible(newVisibility);

    navigator.replace('search', {
      ...searchParams,
      expand: newVisibility ? 1 : 0,
    });
  };

  const renderNoResults = () => (
    <>
      <Typography>
        <FormattedMessage id="search.suggestions.error" />
      </Typography>
    </>
  );

  const renderLoading = () => (
    <>
      <div className={classes.expandSearchTop}>
        <Typography tabIndex="-1" component="h3" className={`${classes.expandTitle} ExpandedSuggestions-title`} variant="subtitle1">
          <FormattedMessage id="search.suggestions.expand" />
        </Typography>
        <IconButton
          role="link"
          aria-label={intl.formatMessage({ id: 'search.closeExpand' })}
          className={classes.backIcon}
          onClick={() => setVisibility(false)}
        >
          <ArrowBack />
        </IconButton>
      </div>
      <Typography>
        <FormattedMessage id="search.suggestions.loading" />
      </Typography>
    </>
  );

  const renderSuggestionList = () => {
    let suggestionList = searchQueries || null;
    if (suggestionList && suggestionList.length) {
      suggestionList = suggestionList.slice(0, 8);
    }
    const handleArrowClick = setSearch ? suggestion => setSearch(suggestion) : null;

    if (suggestionList) {
      return (
        <>
          <div className={classes.expandSearchTop}>
            <Typography tabIndex="-1" component="h3" className={`${classes.expandTitle} ExpandedSuggestions-title`} variant="subtitle1">
              <FormattedMessage id="search.suggestions.expand" />
            </Typography>
            <IconButton
              role="link"
              aria-label={intl.formatMessage({ id: 'search.closeExpand' })}
              className={classes.backIcon}
              onClick={() => setVisibility(false)}
            >
              <ArrowBack />
            </IconButton>
          </div>
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
                handleItemClick={() => {
                  setVisible(false);
                  suggestionClick(item.suggestion);
                }}
                divider
                subtitle={intl.formatMessage({ id: 'search.suggestions.results' }, { count: item.count })}
                isMobile
                query={suggestionQuery}
              />
            ))}
          </List>
          <SMButton
            role="link"
            className={classes.closeButton}
            // onKeyDown={e => handleKeyPress(e)}
            onClick={() => setVisibility(false)}
            messageID="search.closeExpand"
          />
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
    return () => {
      // On unmount abort fetches to avoid memory leak
      if (fetchController && fetchController.current) {
        fetchController.current.abort();
      }
    };
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

  if (!visible) {
    if (searchQueries && searchQueries.length < 1) {
      return null;
    }

    return (
      <SMButton
        small
        role="link"
        onClick={() => { setVisibility(true); }}
        messageID="search.expand"
      />
    );
  }

  /**
  * Render component
  */
  let component = null;
  let srText = null;
  if (loading) {
    component = renderLoading();
    srText = null;
  } else if (searchQueries) {
    component = renderSuggestionList();
    const suggestionList = searchQueries || null;
    srText = intl.formatMessage({ id: 'search.suggestions.suggestions' }, { count: suggestionList.length });
  } else if (suggestionError) {
    component = renderNoResults();
    srText = intl.formatMessage({ id: 'search.suggestions.error' });
  }

  const containerStyles = isMobile
    ? `${classes.containerMobile}`
    : `${classes.container}`;

  return (
    <>
      <Paper elevation={20} className={containerStyles}>
        <p className="sr-only" aria-live="polite">{srText}</p>
        {component}
      </Paper>
    </>
  );
};

ExpandedSuggestions.propTypes = {
  searchQuery: PropTypes.string,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  focusedSuggestion: PropTypes.number,
  setSearch: PropTypes.func,
  intl: intlShape.isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
};

ExpandedSuggestions.defaultProps = {
  searchQuery: null,
  focusedSuggestion: null,
  setSearch: null,
  navigator: null,
};

export default ExpandedSuggestions;
