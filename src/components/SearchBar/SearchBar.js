import React from 'react';

import PropTypes from 'prop-types';
import {
  InputBase, Paper, Typography, Button,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { intlShape } from 'react-intl';
import BackButton from '../BackButton';
import { keyboardHandler } from '../../utils';
import SuggestionBox from './components/SuggestionBox';
import { DesktopComponent, MobileComponent } from '../../layouts/WrapperComponents/WrapperComponents';

class SearchBar extends React.Component {
  blurDelay = 150;

  blurTimeout = null;

  constructor(props) {
    super(props);
    const { initialValue, previousSearch } = props;

    this.state = {
      search: initialValue || previousSearch || '',
      isActive: false,
      focusedSuggestion: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { initialValue } = nextProps;
    // eslint-disable-next-line react/destructuring-assignment
    const oldInitialValue = this.props.initialValue;

    if (oldInitialValue !== initialValue) {
      this.setState({ search: initialValue });
    }
    return true;
  }

  componentWillUnmount() {
    clearTimeout(this.blurTimeout);
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
      this.setState({ isActive: false, focusedSuggestion: null });
      closeExpandedSearch();

      if (search !== previousSearch) {
        this.setState({ search }); // Change current search text to new one
        fetchUnits(search);
      }

      if (navigator) {
        navigator.push('search', { query: search });
      }
    }
  }

  handleBlur = () => {
    const { closeExpandedSearch } = this.props;
    this.blurTimeout = setTimeout(() => {
      this.setState({ isActive: false });
      closeExpandedSearch();
      clearTimeout(this.blurTimeout);
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

  renderSuggestionBox = () => {
    const {
      classes,
      intl,
      searchRef,
      primary,
      expandSearch,
      getLocaleText,
      closeExpandedSearch,
      settings,
      locale,
    } = this.props;
    const { search, isActive, focusedSuggestion } = this.state;

    const showSuggestions = isActive || expandSearch;
    if (!showSuggestions) {
      return null;
    }

    return (
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
        locale={locale}
        isMobile
        query={search}
      />
    );
  }

  renderInput = () => {
    const {
      backButtonEvent,
      classes,
      hideBackButton,
      intl,
      previousSearch,
      searchRef,
      expandSearch,
    } = this.props;
    const { search, isActive } = this.state;

    const previousSearchText = typeof previousSearch === 'string' ? previousSearch : null;

    const showSuggestions = isActive || expandSearch;
    const inputValue = typeof search === 'string' ? search : previousSearchText;

    return (
      <form onSubmit={this.onSubmit} className={classes.container} autoComplete="off">
        {
          (!hideBackButton || showSuggestions)
          && <BackButton className={classes.iconButton} onClick={backButtonEvent || null} variant="icon" srHidden={!!hideBackButton} />
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
          value={inputValue || ''}
          onChange={this.onInputChange}
          onFocus={this.activateSearch}
          onKeyDown={e => keyboardHandler(this.keyHandler(e), ['up, down'])}
          onBlur={this.handleBlur}
        />

        <Button
          aria-label={intl.formatMessage({ id: 'search' })}
          type="submit"
          className={classes.iconButtonSearch}
          classes={{
            label: classes.iconButtonSearchLabel,
          }}
          color="secondary"
          variant="contained"
        >
          <Search />
          <Typography variant="caption" color="inherit">Tee haku</Typography>
        </Button>
      </form>
    );
  }

  renderText = () => {
    const {
      classes,
    } = this.props;

    return (
      <Typography align="left" className={classes.infoText} color="inherit" variant="body2">Hae palveluita, toimipisteitä tai osoitteita</Typography>
    );
  }

  renderMobile = () => {
    const {
      classes,
      className,
      header,
      isSticky,
      primary,
      srHideInput,
    } = this.props;
    const { isActive } = this.state;

    const rootClasses = `${isActive ? classes.mobileRoot : classes.root} ${!isActive && typeof isSticky === 'number' ? classes.sticky : ''} ${primary ? classes.primary : ''}  ${className}`;
    const wrapperClasses = isActive ? classes.mobileWrapper : classes.wrapper;
    const stickyStyles = typeof isSticky === 'number' ? { top: isSticky } : null;

    return (
      <>
        <div aria-hidden={srHideInput} className={rootClasses} style={stickyStyles}>
          {
            !isActive
            && header
            && (
              <Typography align="left" className={classes.headerText} variant="h5" component="p" color="inherit">Pääkaupunkiseudun kaikki julkiset palvelut ulottuvillasi</Typography>
            )
          }
          {
            !isActive
            && (
              this.renderText()
            )
          }
          <Paper className={wrapperClasses} elevation={1} square>
            {
              this.renderInput()
            }
            {
              this.renderSuggestionBox()
            }
          </Paper>
        </div>
      </>
    );
  }

  render() {
    const {
      classes,
      className,
      header,
      isSticky,
      primary,
      srHideInput,
    } = this.props;

    const rootClasses = `${classes.root} ${typeof isSticky === 'number' ? classes.sticky : ''} ${primary ? classes.primary : ''}  ${className}`;
    const wrapperClasses = classes.wrapper;
    const stickyStyles = typeof isSticky === 'number' ? { top: isSticky } : null;

    return (
      <>
        <MobileComponent>
          {this.renderMobile()}
        </MobileComponent>
        <DesktopComponent>
          <div aria-hidden={srHideInput} className={rootClasses} style={stickyStyles}>
            {
              header
              && (
                <Typography align="left" className={classes.headerText} variant="h5" component="p" color="inherit">Pääkaupunkiseudun kaikki julkiset palvelut ulottuvillasi</Typography>
              )
            }
            {
              this.renderText()
            }
            <Paper className={wrapperClasses} elevation={1} square>
              {
                this.renderInput()
              }
              {
                this.renderSuggestionBox()
              }
            </Paper>
          </div>
        </DesktopComponent>
      </>
    );
  }
}

SearchBar.propTypes = {
  backButtonEvent: PropTypes.func,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  className: PropTypes.string,
  fetchUnits: PropTypes.func.isRequired,
  header: PropTypes.bool,
  hideBackButton: PropTypes.bool,
  navigator: PropTypes.objectOf(PropTypes.any),
  initialValue: PropTypes.string,
  intl: intlShape.isRequired,
  isSticky: PropTypes.number,
  isFetching: PropTypes.bool.isRequired,
  searchRef: PropTypes.objectOf(PropTypes.any),
  previousSearch: PropTypes.string,
  expandSearch: PropTypes.string,
  primary: PropTypes.bool,
  closeExpandedSearch: PropTypes.func,
  srHideInput: PropTypes.bool,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
  locale: PropTypes.string.isRequired,
};

SearchBar.defaultProps = {
  previousSearch: null,
  backButtonEvent: null,
  className: '',
  header: false,
  hideBackButton: false,
  initialValue: null,
  isSticky: null,
  navigator: null,
  searchRef: {},
  expandSearch: null,
  primary: false,
  closeExpandedSearch: (() => {}),
  srHideInput: false,
};

export default SearchBar;
