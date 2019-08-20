import React from 'react';

import PropTypes from 'prop-types';
import {
  InputBase, Paper, IconButton, List, ListItem, Typography, Button, Divider,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { intlShape } from 'react-intl';
import BackButton from '../BackButton';
import createSuggestions from './createSuggestions';
import expandSearch from './expandSearch';
import { keyboardHandler } from '../../utils';

class SearchBar extends React.Component {
  suggestionDelay = 0;

  timeout = null;

  fetchController = null;

  constructor(props) {
    super(props);
    this.listRef = React.createRef();
    this.testRef = React.createRef();

    const { previousSearch } = props;

    this.state = {
      search: previousSearch,
      isActive: false,
      searchQueries: [],
      loading: false,
      suggestionError: false,
      focusedSuggestion: null,
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
    const { getLocaleText } = this.props;
    const query = typeof e === 'string' ? e : e.currentTarget.value;
    if (query.length > 2) {
      this.setState({
        loading: true, searchQueries: [], suggestionError: false, focusedSuggestion: null,
      });
      if (this.fetchController) {
        this.fetchController.abort();
      }
      this.fetchController = new AbortController();
      const { signal } = this.fetchController;
      createSuggestions(query, getLocaleText, signal)
        .then((result) => {
          if (result !== 'error') {
            this.fetchController = null;
            this.setState({ searchQueries: result, loading: false, suggestionError: false });
          } else if (!this.fetchController) {
            // TODO: not going here currently
            this.setState({ suggestionError: true, loading: false });
          }
        });
    } else {
      this.setState({ searchQueries: [], loading: false, suggestionError: false });
      if (this.fetchController) {
        this.fetchController.abort();
      }
    }
    this.setState({ search: query });
  }

  onExpandSearch = (item) => {
    const { getLocaleText } = this.props;
    this.setState({ loading: true });
    expandSearch(item, getLocaleText)
      .then(result => this.setState({
        search: result.search,
        searchQueries: result.expandedQueries,
        loading: !!this.fetchController,
      }));
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { search, focusedSuggestion, searchQueries } = this.state;
    if (focusedSuggestion) {
      this.handleSubmit(searchQueries[focusedSuggestion].query);
    } else {
      this.handleSubmit(search);
    }
  }

  handleSubmit = (search) => {
    const { isFetching } = this.props;
    console.log(search);

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
      this.setState({ searchQueries: [], isActive: false });
    }
  }

  handleBlur = () => {
    setTimeout(() => {
      console.log('blur stuff');
      this.setState({ isActive: false, focusedSuggestion: null });
    }, 300);
  }

  suggestionBackEvent = () => {
    this.setState({ searchQueries: [], isActive: false });
  };

  keyHandler = (e) => {
    const { focusedSuggestion } = this.state;
    const list = this.listRef.current;
    if (list && (e.keyCode === 40 || e.keyCode === 38)) {
      e.preventDefault();
      const listEnd = list.props.children.length - 1;
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

  toggleAnimation = () => {
    const { search } = this.state;
    // const { isActive } = this.state;
    // this.setState({ isActive: !isActive });
    /* if (search) {
      console.log('box says: ', search);
      this.onInputChanxge(search);
    } */
    this.setState({ isActive: true });
  }

  showSuggestionBox = () => {
    const {
      search, isActive, searchQueries, loading, suggestionError,
    } = this.state;

    if (isActive || loading || searchQueries || suggestionError) {
      // Show box
    }
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
    } = this.props;
    const {
      search, isActive, searchQueries, loading, suggestionError, focusedSuggestion,
    } = this.state;

    const suggestionList = (searchQueries.length && searchQueries) || null;
    // const showSuggestions = isActive || loading || suggestionList;
    const showSuggestions = isActive || suggestionList || loading;
    const inputValue = typeof search === 'string' ? search : previousSearch;
    const rootClasses = `${classes.root} ${typeof isSticky === 'number' ? classes.sticky : ''} ${primary ? classes.primary : ''} ${showSuggestions ? classes.absolute : ''}  ${className}`;
    const wrapperClasses = `${classes.wrapper} ${isActive || showSuggestions ? classes.wrapperFocused : ''}`;
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
              id="searchInput"
              inputRef={searchRef}
              className={classes.input}
              placeholder={placeholder}
              value={inputValue || ''}
              onChange={this.onInputChange}
              onFocus={this.toggleAnimation}
              onKeyDown={e => keyboardHandler(this.keyHandler(e), ['up, down'])}
              // onBlur={this.handleBlur}
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
          <Button
            variant="outlined"
            style={{
              height: 36, backgroundColor: '#fff', width: 180, /* marginLeft: 'auto', */ marginLeft: '8px',
            }}
            className={classes.suggestionButton}
            onClick={() => this.onExpandSearch({ query: search, count: 50 })}
          >
            <Typography className={classes.expand} variant="body2">
              {'Tarkenna hakua'}
            </Typography>
          </Button>
        )}
        {showSuggestions ? (
          <Paper elevation={20}>
            <div style={{
              zIndex: 999999, minHeight: 'calc(100vh - 64px - 76px)', width: '450px', backgroundColor: '#ffffff', overflow: 'auto',
            }}
            >
              {!loading && suggestionError && (
                <>
                  <div className={classes.suggestionSubtitle}>
                    <Typography className={classes.subtitleText} variant="overline">Tarkoititko..?</Typography>
                  </div>
                  <p style={{ marginTop: '25%', marginBottom: '25%' }}>Ei hakuehdotuksia</p>
                </>
              )}
              {!loading && !suggestionList && !suggestionError && (
                <div className={classes.suggestionSubtitle}>
                  <Typography className={classes.subtitleText} variant="overline">Aikaisemmat haut</Typography>
                </div>
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
                  {suggestionList.map((item, i) => (
                    <>
                      <ListItem
                        selected={i === focusedSuggestion}
                        className="suggestionItem"
                        tabIndex="0"
                        key={item.query}
                        button
                        role="link"
                        onClick={() => this.handleSubmit(item.query)}
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
                      <Divider className={classes.divider} />
                      )}
                    </>
                  ))}
                </List>
              </>
              )}
            </div>
          </Paper>
        ) : null}
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
