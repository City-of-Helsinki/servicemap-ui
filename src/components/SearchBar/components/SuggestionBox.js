import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Search } from '@material-ui/icons';
import {
  Paper, List, ListItem, Typography, Divider,
} from '@material-ui/core';
import expandSearch from '../expandSearch';
import { getPreviousSearches } from '../previousSearchData';
import PreviousSearches from '../PreviousSearches';
import createSuggestions from '../createSuggestions';


const SuggestionBox = ({
  visible, searchQuery, expandedQuery, handleSubmit, classes, getLocaleText, focusedSuggestion, setSearch,
}) => {
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

  const handleExpandSearch = (item) => {
    if (!item) {
      if (expandedQueries) {
        setExpandedQueries(null);
      }
    } else {
      setLoading('expanded');
      setSearchQueries(null);
      expandSearch(item, getLocaleText)
        .then((result) => {
          setLoading(false);
          setExpandedQueries(result.expandedQueries);
        });
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
        <Typography className={classes.subtitleText} variant="overline">Tarkoititko..?</Typography>
      </div>
      <p aria-live="polite" style={{ marginTop: '25%', marginBottom: '25%' }}>Ei hakuehdotuksia</p>
    </>
  );

  const renderLoading = () => (
    <>
      <div className={classes.suggestionSubtitle}>
        <Typography className={classes.subtitleText} variant="overline">{loading === 'suggestions' ? 'Tarkoititko..?' : 'Tarkenna hakua'}</Typography>
      </div>
      <p aria-live="polite" style={{ marginTop: '25%', marginBottom: '25%' }}>Ladataan hakuehdotuksia</p>
    </>
  );

  const renderSuggestionList = () => {
    const suggestionList = expandedQueries || searchQueries || null;
    const title = expandedQueries ? 'Tarkenna hakua' : 'Tarkoititko..?';
    if (suggestionList) {
      return (
        <>
          <div className={classes.suggestionSubtitle}>
            <Typography className={classes.subtitleText} variant="overline">{title}</Typography>
          </div>
          {/* <p aria-live="polite" className="sr-only">{`${suggestionList.length} hakuehdotusta sanalla ${searchQuery}`}</p> */}
          <List className="suggestionList" ref={listRef}>
            {suggestionList.map((item, i) => (
              <>
                <ListItem
                  // aria-live={i === focusedSuggestion ? 'polite' : null}
                  // role={i === focusedSuggestion ? 'alert' : 'link'}
                  // aria-label={i === focusedSuggestion ? item.query}
                  selected={i === focusedSuggestion}
                  tabIndex="0"
                  key={item.query}
                  button
                  role="link"
                  onClick={() => handleSubmit(item.query)}
                >
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <Search className={classes.listIcon} />
                    <div>
                      <Typography variant="body2">{`${item.query}`}</Typography>
                      <Typography variant="caption">{`${item.count} tulosta`}</Typography>
                    </div>
                  </div>
                </ListItem>
                {i !== suggestionList.length - 1 && (
                <Divider aria-hidden className={classes.divider} />
                )}
              </>
            ))}
          </List>
        </>
      );
    } return null;
  };

  useEffect(() => {
    if (expandedQuery) {
      handleExpandSearch(expandedQuery);
    } else if (searchQuery && focusedSuggestion === null) {
      generateSuggestions(searchQuery);
    }
  }, [searchQuery, expandedQuery]);

  useEffect(() => {
    setSearchBarText();
  }, [focusedSuggestion]);

  // Render component
  if (visible) {
    let component = null;
    if (loading) {
      component = renderLoading();
    } else if (searchQueries || expandedQueries) {
      component = renderSuggestionList();
    } else if (suggestionError) {
      component = renderNoResults();
    } else {
      component = renderSearchHistory();
    }

    return (
      <Paper elevation={20}>
        <div style={{
          zIndex: 999999, minHeight: 'calc(100vh - 64px - 76px)', width: '450px', backgroundColor: '#ffffff', overflow: 'auto',
        }}
        >
          {component}
          {/* (!search || search.length < 3) && renderSearchHistory()}
          {loading && renderLoading()}
          {!loading && renderSuggestionList()}
          {!loading && suggestionError && renderNoResults() */}
        </div>
      </Paper>
    );
  }
  return <></>;
};

export default SuggestionBox;
