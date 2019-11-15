import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Search, ArrowBack } from '@material-ui/icons';
import {
  Paper, List, Typography, IconButton,
} from '@material-ui/core';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import { FormattedMessage, intlShape } from 'react-intl';
import { getPreviousSearches } from '../../previousSearchData';
import PreviousSearches from '../../PreviousSearches';
import createSuggestions from '../../createSuggestions';
import config from '../../../../../config';
import ServiceMapButton from '../../../ServiceMapButton';
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
    expandQuery,
    closeExpandedSearch,
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

  /* TODO: Utilize city information with search queries
  const cities = [
    ...settings.helsinki ? ['Helsinki'] : [],
    ...settings.espoo ? ['Espoo'] : [],
    ...settings.vantaa ? ['Vantaa'] : [],
    ...settings.kauniainen ? ['Kauniainen'] : [],
  ];
  */

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

  const handleKeyPress = (e) => {
    // Close suggestion box if tab is pressed in last list result
    if (e.key === 'Tab' && !(e.shiftKey && e.key === 'Tab')) {
      e.preventDefault();
      closeExpandedSearch();
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
      <div className={classes.suggestionSubtitle}>
        <Typography className={classes.subtitleText} variant="overline">
          <FormattedMessage id="search.suggestions.suggest" />
        </Typography>
      </div>
      <Typography>
        <FormattedMessage id="search.suggestions.error" />
      </Typography>
    </>
  );

  const renderLoading = () => (
    <>
      {
        expandQuery
        && (
          <div className={classes.expandSearchTop}>
            <Typography tabIndex="-1" component="h3" className={`${classes.expandTitle} suggestionsTitle`} variant="subtitle1">
              <FormattedMessage id="search.suggestions.expand" />
            </Typography>
            <IconButton
              role="link"
              aria-label={intl.formatMessage({ id: 'search.closeExpand' })}
              className={classes.backIcon}
              onClick={() => closeExpandedSearch()}
            >
              <ArrowBack />
            </IconButton>
          </div>
        )
      }
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
    const titleId = expandQuery ? 'search.suggestions.expand' : 'search.suggestions.suggest';
    const handleArrowClick = setSearch ? suggestion => setSearch(suggestion) : null;

    if (suggestionList) {
      return (
        <>
          {
            expandQuery
            && (
              <div className={classes.expandSearchTop}>
                <Typography tabIndex="-1" component="h3" className={`${classes.expandTitle} suggestionsTitle`} variant="subtitle1">
                  <FormattedMessage id={titleId} />
                </Typography>
                <IconButton
                  role="link"
                  aria-label={intl.formatMessage({ id: 'search.closeExpand' })}
                  className={classes.backIcon}
                  onClick={() => closeExpandedSearch()}
                >
                  <ArrowBack />
                </IconButton>
              </div>
            )
          }
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
          {expandQuery && (
            <ServiceMapButton
              role="link"
              className={classes.closeButton}
              onKeyDown={e => handleKeyPress(e)}
              onClick={() => closeExpandedSearch()}
            >
              <Typography variant="button">
                <FormattedMessage id="search.closeExpand" />
              </Typography>
            </ServiceMapButton>
          )}
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
    if (visible) {
      sidebar.style.overflow = isMobile ? '' : 'hidden';
    } else {
      sidebar.style.overflow = isMobile ? '' : 'auto';
    }
  }, [visible]);

  /**
  * Render component
  */
  if (visible) {
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
    } else {
      component = renderSearchHistory();
    }

    const containerStyles = isMobile
      ? `${expandQuery ? classes.expandHeightMobile : classes.suggestionAreaMobile}`
      : `${expandQuery ? classes.expandHeight : classes.suggestionArea}`;

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
  expandQuery: PropTypes.bool,
  closeExpandedSearch: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  focusedSuggestion: PropTypes.number,
  setSearch: PropTypes.func,
  intl: intlShape.isRequired,
};

SuggestionBox.defaultProps = {
  visible: false,
  searchQuery: null,
  expandQuery: null,
  focusedSuggestion: null,
  setSearch: null,
};

export default SuggestionBox;
