import React from 'react';

import PropTypes from 'prop-types';
import {
  InputBase, Paper, IconButton, Typography, Button,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { intlShape } from 'react-intl';
import BackButton from '../BackButton';
import { keyboardHandler } from '../../utils';
import PreviousSearches from './PreviousSearches';
import SuggestionBox from './components/SuggestionBox';

class SearchBar extends React.Component {
  suggestionDelay = 40;

  timeout = null;

  fetchController = null;

  focusedItem = null;

  constructor(props) {
    super(props);
    this.listRef = React.createRef();
    this.testRef = React.createRef();

    const { previousSearch } = props;

    this.state = {
      search: previousSearch,
      isActive: false,
      focusedSuggestion: null,
      expandedQuery: null,
    };
  }

  shouldComponentUpdate(nextProps) {
    const { previousSearch } = this.props;
    // If previousSearch changes change current search text
    if (
      previousSearch
      && nextProps
      && nextProps.previousSearch
      && previousSearch !== nextProps.previousSearch
    ) {
      this.setState({ search: nextProps.previousSearch });
      return false;
    }
    return true;
  }

  onInputChange = (e) => {
    const query = typeof e === 'string' ? e : e.currentTarget.value;
    this.setState({ search: query, focusedSuggestion: null });
  }

  keyHandler = (e) => {
    const { focusedSuggestion } = this.state;
    const list = document.getElementsByClassName('suggestionList')[0];
    if (e.keyCode === 40 || e.keyCode === 38) {
      e.preventDefault();
      const listEnd = (list.children.length + 1) / 2 - 1; // TODO: fix this calculation once we have correct list item component
      const increment = e.keyCode === 40;
      let index = focusedSuggestion;

      switch (index) {
        case null:
          index = increment ? 0 : listEnd;
          break;
        case 0:
          index = increment ? 1 : listEnd;
          break;
        case listEnd:
          index = increment ? 0 : listEnd - 1;
          break;
        default:
          index = increment ? index + 1 : index - 1;
      }

      this.setState({ focusedSuggestion: index });
    }
  }

  onExpandSearch = (item) => {
    this.setState({ expandedQuery: item });
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { search, focusedSuggestion, searchQueries, suggestionError, } = this.state;
    const suggestionList = (searchQueries.length && searchQueries) || null;
    if (focusedSuggestion !== null) {
      if (!suggestionError && !suggestionList) {
        const { text } = this.listRef.current.props.children[focusedSuggestion].props;
        if (text) {
          this.handleSubmit(text);
        }
        return;
      } else {
      const query = document.getElementsByClassName('suggestionItem')[focusedSuggestion].innerHTML;
      this.handleSubmit(query);
      }
    } else {
      this.handleSubmit(search);
    }
  }

  handleSubmit = (search) => {
    const { isFetching } = this.props;
    if (!isFetching && search && search !== '') {
      const {
        fetchUnits, navigator, previousSearch,
      } = this.props;
      if (navigator) {
        navigator.push('search', search);
      }

      if (search !== previousSearch) {
        fetchUnits([], null, search);
      }
    }
    this.setState({ isActive: false, expandedQuery: null, focusedSuggestion: null });
  }

  handleBlur = () => {
    setTimeout(() => {
      this.setState({ isActive: false });
    }, 150);
  }

  suggestionBackEvent = () => {
    this.setState({ expandedQuery: null, isActive: false });
  };

  toggleAnimation = () => {
    const { search } = this.state;
    if (search) {
      this.onInputChange(search);
    }
    this.setState({ isActive: true, expandedQuery: null });
  }

  render() {
    const {
      backButtonEvent,
      classes,
      className,
      intl,
      isSticky,
      placeholder,
      previousSearch,
      hideBackButton,
      searchRef,
      primary,
      expand,
      isFetching,
      getLocaleText,
    } = this.props;
    const {
      search, isActive, expandedQuery, focusedSuggestion,
    } = this.state;

    const showSuggestions = isActive || expandedQuery;
    const inputValue = typeof search === 'string' ? search : previousSearch;
    const rootClasses = `${classes.root} ${typeof isSticky === 'number' ? classes.sticky : ''} ${primary ? classes.primary : ''}  ${className}`;
    const wrapperClasses = `${classes.wrapper} ${showSuggestions ? classes.wrapperFocused : ''}`;
    const stickyStyles = typeof isSticky === 'number' ? { top: isSticky } : null;

    return (
      <div className={rootClasses} style={stickyStyles}>
        <Paper className={wrapperClasses} elevation={1} square>
          <form onSubmit={this.onSubmit} className={classes.container} autoComplete="off">
            {
              (!hideBackButton || showSuggestions)
              && <BackButton className={classes.iconButton} onClick={showSuggestions ? this.suggestionBackEvent : backButtonEvent || null} variant="icon" />
            }
            <InputBase
              // role="alert"
              // aria-live="polite"
              // aria-label={search}
              id="searchInput"
              inputRef={searchRef}
              className={classes.input}
              placeholder={placeholder}
              value={inputValue || ''}
              onChange={this.onInputChange}
              onFocus={this.toggleAnimation}
              onKeyDown={e => keyboardHandler(this.keyHandler(e), ['up, down'])}
              onBlur={this.handleBlur}
            />

            <IconButton
              aria-label={intl.formatMessage({ id: 'search' })}
              type="submit"
              className={classes.icon}
            >
              <Search />
            </IconButton>
          </form>
        </Paper>
        {expand && !showSuggestions && !isFetching && (
          <>
            <Button
              variant="outlined"
              style={{
                height: 36, backgroundColor: '#fff', width: 180, marginLeft: '8px',
              }}
              className={classes.suggestionButton}
              onClick={() => this.onExpandSearch({ query: search, count: 50 })}
            >
              <Typography className={classes.expand} variant="body2">
                {'Tarkenna hakua'}
              </Typography>
            </Button>
            {/* Another expand implementation
            <div style={{
              margin: 5, maxHeight: '340px', backgroundColor: '#ffffff', overflow: 'auto',
            }}
            >
              {showExpanded && loading && (
                <p style={{ marginTop: '25%', marginBottom: '25%' }}>Ladataan hakuehdotuksia</p>
              )}
              {!loading && !suggestionList && !suggestionError && (
                <PreviousSearches
                  focusIndex={focusedSuggestion}
                  listRef={this.listRef}
                  onClick={val => this.handleSubmit(val)}
                />
              )}
              {loading && (
                <>
                  <div className={classes.suggestionSubtitle}>
                    <Typography className={classes.subtitleText} variant="overline">Tarkoititko..?</Typography>
                  </div>
                  <p style={{ marginTop: '25%', marginBottom: '25%' }}>Ladataan hakuehdotuksia</p>
                </>
              )}
              {!loading && suggestionList && (
              <>
                <div className={classes.suggestionSubtitle}>
                  <Typography className={classes.subtitleText} variant="overline">Tarkoititko..?</Typography>
                </div>

                <List ref={this.listRef}>
                  {expandedQueries.map((item, i) => (
                    <>
                      <ListItem
                        selected={i === focusedSuggestion}
                        className="suggestionItem"
                        tabIndex="0"
                        key={item.query}
                        button
                        role="link"
                        onClick={() => this.handleSubmit(item.query, 'click')}
                      >
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                          <Search className={classes.listIcon} />
                          <div>
                            <Typography variant="body2">{`${item.query}`}</Typography>
                            <Typography variant="caption">{`${item.count} tulosta`}</Typography>
                          </div>
                        </div>
                      </ListItem>
                      {i !== expandedQueries.length - 1 && (
                      <Divider className={classes.divider} />
                      )}
                    </>
                  ))}
                </List>
              )}
            </div> */}
          </>
        )}
        <SuggestionBox
          visible={showSuggestions}
          focusedSuggestion={focusedSuggestion}
          expandedQuery={expandedQuery}
          classes={classes}
          searchQuery={search}
          handleSubmit={this.handleSubmit}
          getLocaleText={getLocaleText}
          setSearch={value => this.setState({ search: value })}
        />
      </div>
    );
  }
}

SearchBar.propTypes = {
  backButtonEvent: PropTypes.func,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  className: PropTypes.string,
  fetchUnits: PropTypes.func.isRequired,
  hideBackButton: PropTypes.bool,
  navigator: PropTypes.objectOf(PropTypes.any),
  intl: intlShape.isRequired,
  isSticky: PropTypes.number,
  isFetching: PropTypes.bool.isRequired,
  placeholder: PropTypes.string.isRequired,
  searchRef: PropTypes.objectOf(PropTypes.any),
  previousSearch: PropTypes.string,
  expand: PropTypes.bool,
  primary: PropTypes.bool,
};

SearchBar.defaultProps = {
  previousSearch: null,
  backButtonEvent: null,
  className: '',
  hideBackButton: false,
  isSticky: null,
  navigator: null,
  searchRef: {},
  expand: false,
  primary: false,
};

export default SearchBar;
