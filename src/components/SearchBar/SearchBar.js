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


let fetchController = null;

class SearchBar extends React.Component {
  suggestionDelay = 400;

  timeout = null;

  constructor(props) {
    super(props);

    const { previousSearch } = props;

    this.state = {
      search: previousSearch,
      isActive: false,
      searchQueries: [],
      loading: false,
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
    const query = e.currentTarget.value;
    if (query.length > 2) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.setState({ loading: true, searchQueries: [] });
        if (fetchController) {
          fetchController.abort();
        }
        fetchController = new AbortController();
        const { signal } = fetchController;
        createSuggestions(query, getLocaleText, signal)
          .then((result) => {
            if (result !== 'error') {
              fetchController = null;
              this.setState({ searchQueries: result, loading: false });
            }
          });
      }, this.suggestionDelay);
    } else {
      this.setState({ searchQueries: [], loading: false });
      if (fetchController) {
        fetchController.abort();
      }
    }
    this.setState({ search: query });
  }

  onExpandSearch = (item) => {
    const { getLocaleText } = this.props;
    expandSearch(item, getLocaleText)
      .then(result => this.setState({
        search: result.search,
        searchQueries: result.expandedQueries,
      }));
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { search } = this.state;
    this.handleSubmit(search);
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
      this.setState({ searchQueries: [] });
    }
  }

  suggestionBackEvent = () => {
    this.setState({ searchQueries: [] });
  };

  toggleAnimation = () => {
    const { isActive } = this.state;
    this.setState({ isActive: !isActive });
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
    } = this.props;
    const {
      search, isActive, searchQueries, loading,
    } = this.state;

    const suggestionList = (searchQueries.length && searchQueries) || null;
    const showSuggestions = isActive || loading || suggestionList;
    const inputValue = typeof search === 'string' ? search : previousSearch;
    const rootClasses = `${classes.root} ${typeof isSticky === 'number' ? classes.sticky : ''} ${primary ? classes.primary : ''} ${showSuggestions ? classes.absolute : ''} ${className}`;
    const wrapperClasses = `${classes.wrapper} ${isActive || showSuggestions ? classes.wrapperFocused : ''}`;
    const stickyStyles = typeof isSticky === 'number' ? { top: isSticky } : null;

    return (
      <div className={rootClasses} style={stickyStyles}>
        <Paper className={wrapperClasses} elevation={1} square>
          <form onSubmit={this.onSubmit} className={classes.container} autoComplete="off">
            {
              !hideBackButton
              && <BackButton className={classes.iconButton} onClick={suggestionList ? this.suggestionBackEvent : backButtonEvent || null} variant="icon" />
            }
            <InputBase
              id="searchInput"
              inputRef={searchRef}
              className={classes.input}
              placeholder={placeholder}
              value={inputValue || ''}
              onChange={this.onInputChange}
              onFocus={this.toggleAnimation}
              onBlur={this.toggleAnimation}
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
        {expand && !showSuggestions && (
          <Button
            variant="outlined"
            style={{
              height: 36, backgroundColor: '#fff', width: 120, marginLeft: 'auto', marginRight: '8px',
            }}
            className={classes.suggestionButton}
            onClick={() => this.onExpandSearch({ query: search, count: 50 })}
          >
            <Typography className={classes.expand} variant="body2">
              {'Tarkenna'}
            </Typography>
          </Button>
        )}
        {isActive || loading || (suggestionList && suggestionList.length) ? (
          <Paper elevation={20}>
            <div style={{
              zIndex: 999999, minHeight: 'calc(100vh - 64px - 76px)', width: '450px', backgroundColor: '#ffffff', overflow: 'auto',
            }}
            >
              {!loading && !suggestionList && (
                <div className={classes.suggestionSubtitle}>
                  <Typography className={classes.subtitleText} variant="overline">AIKAISEMMAT HAUT</Typography>
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
                <List>
                  {suggestionList.map((item, i) => (
                    <>
                      <ListItem
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
