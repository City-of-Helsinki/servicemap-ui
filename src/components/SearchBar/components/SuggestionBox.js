import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Search } from '@material-ui/icons';
import { Paper, List, Typography } from '@material-ui/core';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import { FormattedMessage, intlShape } from 'react-intl';
import expandSearch from '../expandSearch';
import { getPreviousSearches } from '../previousSearchData';
import PreviousSearches from '../PreviousSearches';
import createSuggestions from '../createSuggestions';
import ResultItem from '../../ListItems/ResultItem/ResultItem';

import config from '../../../../config';
import { MobileComponent } from '../../../layouts/WrapperComponents/WrapperComponents';
import ServiceMapButton from '../../ServiceMapButton';


const SuggestionBox = (props) => {
  const {
    visible,
    searchQuery,
    handleSubmit,
    classes,
    getLocaleText,
    focusedSuggestion,
    setSearch,
    intl,
    expandQuery,
    closeExpandedSearch,
  } = props;

  const [searchQueries, setSearchQueries] = useState(null);
  const [expandedQueries, setExpandedQueries] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState(false);
  const [history] = useState(getPreviousSearches());

  const listRef = useRef(null);
  const fetchController = useRef(null);


  const generateSuggestions = (query) => {
    setSearchQueries(null);
    setExpandedQueries(null);
    setSuggestionError(false);

    if (query && query.length > 2) {
      setLoading('suggestions');

      if (fetchController.current) {
        fetchController.current.abort();
      }
      fetchController.current = new AbortController();
      const { signal } = fetchController.current;

      createSuggestions(query, getLocaleText, signal)
        .then((result) => {
          if (result !== 'error') {
            fetchController.current = null;
            if (result.length) {
              setSearchQueries(result);
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

  const handleExpandSearch = () => {
    setLoading('expanded');
    setSearchQueries(null);
    expandSearch(expandQuery, getLocaleText)
      .then((result) => {
        setLoading(false);
        setExpandedQueries(result.expandedQueries);
      });
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
          setSearch(searchQueries[focusedSuggestion].query);
        } else if (history) {
          setSearch(history[focusedSuggestion]);
        }
      }
    }
  };

  const renderSearchHistory = () => (
    <>
      <PreviousSearches
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
      <div className={classes.suggestionSubtitle}>
        <Typography className={classes.subtitleText} variant="overline">
          <FormattedMessage id={loading === 'suggestions' ? 'search.suggestions.suggest' : 'search.suggestions.expand'} />
        </Typography>
      </div>
      <Typography>
        <FormattedMessage id="search.suggestions.loading" />
      </Typography>
    </>
  );

  const renderSuggestionList = () => {
    const suggestionList = expandedQueries || searchQueries || null;
    const titleId = expandedQueries ? 'search.suggestions.expand' : 'search.suggestions.suggest';
    if (suggestionList) {
      return (
        <>
          <div className={classes.suggestionSubtitle}>
            <Typography tabIndex="0" component="h3" className={`${classes.subtitleText} suggestionsTitle`} variant="overline">
              <FormattedMessage id={titleId} />
            </Typography>
          </div>
          <List className="suggestionList" ref={listRef}>
            {suggestionList.map((item, i) => (
              <ResultItem
                key={item.query}
                icon={<Search className={classes.listIcon} />}
                title={item.query}
                subtitle={intl.formatMessage({ id: 'search.suggestions.results' }, { count: item.count })}
                srLabel={intl.formatMessage({ id: 'search' })}
                onClick={() => handleSubmit(item.query)}
                selected={i === focusedSuggestion}
                divider={i !== suggestionList.length - 1}
                onKeyDown={i === suggestionList.length - 1 ? e => handleKeyPress(e) : null}
              />
            ))}
          </List>
          {expandedQueries && (
            <ServiceMapButton className={classes.closeButton} onClick={() => closeExpandedSearch()}>
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
    if (searchQuery && focusedSuggestion === null) {
      generateSuggestions(searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => { // Start expanded search when expand button is toggled on. Else clear data.
    if (expandQuery) {
      handleExpandSearch();
    } else {
      setExpandedQueries(null);
    }
  }, [expandQuery]);

  useEffect(() => { // Change text of the searchbar when suggestion with keyboard focus changes
    setSearchBarText();
  }, [focusedSuggestion]);

  useEffect(() => { // Focus on list title when expanded queries appear
    if (expandedQueries) {
      document.getElementsByClassName('suggestionsTitle')[0].focus();
    }
  }, [expandedQueries]);

  const isMobile = useMediaQuery(`(max-width:${config.mobileUiBreakpoint}px)`);

  useEffect(() => {
    // Disable page scroll when suggestion box is open
    const sidebar = document.getElementsByClassName('SidebarWrapper')[0];
    if (visible) {
      sidebar.style.overflow = 'hidden';
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
    } else if (searchQueries || expandedQueries) {
      component = renderSuggestionList();
      const suggestionList = expandedQueries || searchQueries || null;
      srText = intl.formatMessage({ id: 'search.suggestions.suggestions' }, { count: suggestionList.length });
    } else if (suggestionError) {
      component = renderNoResults();
      srText = intl.formatMessage({ id: 'search.suggestions.error' });
    } else {
      component = renderSearchHistory();
    }

    return (
      <>
        <Paper elevation={20} className={classes.suggestionArea}>
          <p className="sr-only" aria-live="polite">{srText}</p>
          {component}
        </Paper>
        <MobileComponent>
          <div className={classes.mobileBackdrop} />
        </MobileComponent>
      </>
    );
  }
  return <></>;
};

SuggestionBox.propTypes = {
  visible: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  searchQuery: PropTypes.string,
  expandQuery: PropTypes.string,
  closeExpandedSearch: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  getLocaleText: PropTypes.func.isRequired,
  focusedSuggestion: PropTypes.number,
  setSearch: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

SuggestionBox.defaultProps = {
  visible: false,
  searchQuery: null,
  expandQuery: null,
  focusedSuggestion: null,
};

export default SuggestionBox;
