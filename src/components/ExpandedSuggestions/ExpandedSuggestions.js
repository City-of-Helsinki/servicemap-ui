import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Search } from '@material-ui/icons';
import {
  Paper, List, Typography,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import createSuggestions from '../SearchBar/createSuggestions';
import config from '../../../config';
import SMButton from '../ServiceMapButton';
import SuggestionItem from '../ListItems/SuggestionItem';
import TitleBar from '../TitleBar';
import AddressItem from '../ListItems/AddressItem';


const ExpandedSuggestions = (props) => {
  const {
    button,
    searchQuery,
    classes,
    intl,
    navigator,
    onClick,
    isVisible,
    isMobile,
    locale,
  } = props;

  const [searchQueries, setSearchQueries] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState(false);
  // Query word on which suggestion list is based
  const [suggestionQuery, setSuggestionQuery] = useState(null);

  const listRef = useRef(null);
  const fetchController = useRef(null);
  // const titleRef = useRef(null);

  let suggestionList = searchQueries || null;
  if (suggestionList && suggestionList.length) {
    suggestionList = suggestionList.slice(0, 8);
  }

  useEffect(() => {
    if (!isVisible) {
      return;
    }
    setTimeout(() => {
      const title = document.getElementsByClassName('ExpandedSuggestions-title')[0];
      if (title) {
        title.firstChild.focus();
      }
    }, 1);
  }, [isVisible]);

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

  const suggestionClick = (query) => {
    if (query && query !== '' && navigator) {
      if (onClick) {
        onClick();
      }
      navigator.push('search', { q: query });
    }
  };

  const renderNoResults = () => (
    <>
      <Typography>
        <FormattedMessage id="search.suggestions.error" />
      </Typography>
    </>
  );

  const renderTitleBar = () => (
    <TitleBar
      backButton
      backButtonOnClick={onClick}
      backButtonText={intl.formatMessage({ id: 'search.closeExpand' })}
      backButtonSrText={intl.formatMessage({ id: 'search.closeExpand' })}
      className={`${classes.titleBar} ExpandedSuggestions-title`}
      titleComponent="h3"
      title={<FormattedMessage id="search.suggestions.expand" />}
    />
  );

  const renderLoading = () => (
    <>
      {
        renderTitleBar()
      }
      <Typography className={classes.padding}>
        <FormattedMessage id="search.suggestions.loading" />
      </Typography>
    </>
  );

  const renderSuggestionList = () => {
    if (suggestionList) {
      return (
        <>
          {
            renderTitleBar()
          }
          <List className="suggestionList" ref={listRef}>
            {suggestionList.map((item) => {
              if (item.object_type === 'suggestion') {
                return (
                  <SuggestionItem
                    key={item.suggestion + item.count}
                    icon={<Search />}
                    text={item.suggestion}
                    handleItemClick={() => {
                      suggestionClick(item.suggestion);
                    }}
                    divider
                    subtitle={intl.formatMessage({ id: 'search.suggestions.results' }, { count: item.count })}
                    query={suggestionQuery}
                  />
                );
              }
              if (item.object_type === 'address') {
                const sortIndex = item.sort_index;
                return (
                  <AddressItem key={`address-${sortIndex}`} address={item} />
                );
              }
              return null;
            })}
          </List>
          <div className={classes.bottomContent}>
            <SMButton
              role="link"
              className={classes.closeButton}
              onClick={onClick}
              messageID="search.closeExpand"
            />
          </div>
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
    if (searchQuery) {
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

  useEffect(() => {
    // Disable page scroll when suggestion box is open
    const sidebar = document.getElementsByClassName('SidebarWrapper')[0];
    const app = document.getElementsByClassName('App')[0];
    if (isVisible) {
      sidebar.style.overflow = 'hidden';
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
  }, [isVisible]);

  if (button) {
    if (!searchQueries || searchQueries.length < 1) {
      return null;
    }

    return null;
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
  button: PropTypes.bool,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  isVisible: PropTypes.bool,
  isMobile: PropTypes.bool,
  navigator: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  locale: PropTypes.oneOf(config.supportedLanguages).isRequired,
};

ExpandedSuggestions.defaultProps = {
  button: false,
  searchQuery: null,
  navigator: null,
  isVisible: false,
  isMobile: false,
};

export default ExpandedSuggestions;
