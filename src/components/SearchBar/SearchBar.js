import React from 'react';

import PropTypes from 'prop-types';
import { InputBase, Paper, IconButton } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { intlShape } from 'react-intl';
import BackButton from '../BackButton';
import { keyboardHandler } from '../../utils';
import SuggestionBox from './components/SuggestionBox';

class SearchBar extends React.Component {
  blurDelay = 150;

  constructor(props) {
    super(props);
    const { previousSearch } = props;

    this.state = {
      search: previousSearch,
      isActive: false,
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
    const query = typeof e === 'string' ? e : e.currentTarget.value;
    this.setState({ search: query, focusedSuggestion: null });
  }

  keyHandler = (e) => {
    const { focusedSuggestion } = this.state;
    const list = document.getElementsByClassName('suggestionList')[0];
    if (e.keyCode === 40 || e.keyCode === 38) {
      e.preventDefault();
      // TODO: fix calculation on next line when dividers are excluded from lists
      const listEnd = (list.children.length + 1) / 2 - 1;
      const increment = e.keyCode === 40;
      let index = focusedSuggestion;

      switch (index) {
        case null:
          index = increment ? 0 : listEnd;
          break;
        case 0:
          // Check that list has more than 1 element
          index = listEnd && increment ? 1 : listEnd;
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


  onSubmit = (e) => {
    e.preventDefault();
    const { search } = this.state;
    this.handleSubmit(search);
  }

  handleSubmit = (search) => {
    const { isFetching, closeExpandedSearch } = this.props;
    if (!isFetching && search && search !== '') {
      const {
        fetchUnits, navigator, previousSearch,
      } = this.props;
      if (navigator) {
        navigator.push('search', { query: search });
      }

      if (search !== previousSearch) {
        fetchUnits(search);
      }
    }
    this.setState({ isActive: false, focusedSuggestion: null });
    closeExpandedSearch();
  }

  handleBlur = () => {
    const { closeExpandedSearch } = this.props;
    setTimeout(() => {
      this.setState({ isActive: false });
      closeExpandedSearch();
    }, this.blurDelay);
  }

  suggestionBackEvent = () => {
    const { closeExpandedSearch } = this.props;
    this.setState({ isActive: false });
    closeExpandedSearch();
  };

  activateSearch = () => {
    const { closeExpandedSearch } = this.props;
    const { search } = this.state;
    if (search) {
      this.onInputChange(search);
    }
    this.setState({ isActive: true });
    closeExpandedSearch();
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
      getLocaleText,
      expandSearch,
      closeExpandedSearch,
      srHideInput,
      settings,
    } = this.props;
    const { search, isActive, focusedSuggestion } = this.state;

    const showSuggestions = isActive || expandSearch;
    const inputValue = typeof search === 'string' ? search : previousSearch;
    const rootClasses = `${classes.root} ${typeof isSticky === 'number' ? classes.sticky : ''} ${primary ? classes.primary : ''}  ${className}`;
    const wrapperClasses = `${classes.wrapper} ${showSuggestions ? classes.wrapperFocused : ''}`;
    const stickyStyles = typeof isSticky === 'number' ? { top: isSticky } : null;

    return (
      <>
        <div aria-hidden={srHideInput} className={rootClasses} style={stickyStyles}>
          <Paper className={wrapperClasses} elevation={1} square>
            <form onSubmit={this.onSubmit} className={classes.container} autoComplete="off">
              {
              (!hideBackButton || showSuggestions)
              && <BackButton className={classes.iconButton} onClick={showSuggestions ? this.suggestionBackEvent : backButtonEvent || null} variant="icon" srHidden={!!hideBackButton} />
            }
              <InputBase
                inputProps={{
                  role: 'combobox',
                  type: 'text',
                  'aria-haspopup': !!showSuggestions,
                  'aria-label': intl.formatMessage({ id: 'search.searchField' }),
                }}
                inputRef={searchRef}
                className={classes.input}
                placeholder={placeholder}
                value={inputValue || ''}
                onChange={this.onInputChange}
                onFocus={this.activateSearch}
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
        </div>
        <div className={`${classes.primary} ${classes.root}`}>
          <SuggestionBox
            visible={showSuggestions}
            focusedSuggestion={focusedSuggestion}
            searchQuery={search || (searchRef.current && searchRef.current.value) || null}
            expandQuery={expandSearch}
            classes={classes}
            intl={intl}
            handleSubmit={this.handleSubmit}
            getLocaleText={getLocaleText}
            setSearch={value => this.setState({ search: value })}
            closeExpandedSearch={closeExpandedSearch}
            settings={settings}
          />
        </div>
      </>
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
  expandSearch: PropTypes.string,
  primary: PropTypes.bool,
  getLocaleText: PropTypes.func.isRequired,
  closeExpandedSearch: PropTypes.func,
  srHideInput: PropTypes.bool,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
};

SearchBar.defaultProps = {
  previousSearch: null,
  backButtonEvent: null,
  className: '',
  hideBackButton: false,
  isSticky: null,
  navigator: null,
  searchRef: {},
  expandSearch: null,
  primary: false,
  closeExpandedSearch: (() => {}),
  srHideInput: false,
};

export default SearchBar;
