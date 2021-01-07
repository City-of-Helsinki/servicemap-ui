import React from 'react';

import PropTypes from 'prop-types';
import {
  InputBase, Paper, Typography, Button, IconButton, Divider,
} from '@material-ui/core';
import {
  Search, Cancel,
} from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import BackButton from '../BackButton';
import { keyboardHandler } from '../../utils';
import SuggestionBox from './components/SuggestionBox';
import MobileComponent from '../MobileComponent';
import DesktopComponent from '../DesktopComponent';

class SearchBar extends React.Component {
  blurDelay = 150;

  blurTimeout = null;

  rootClass = 'SearchBar';

  searchRef = null;

  constructor(props) {
    super(props);
    const { initialValue, previousSearch } = props;

    this.searchRef = React.createRef();

    this.state = {
      initialSearchValue: previousSearch || initialValue || '',
      isActive: false,
      focusedSuggestion: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { initialValue } = nextProps;
    // eslint-disable-next-line react/destructuring-assignment
    const oldInitialValue = this.props.initialValue;

    if (oldInitialValue !== initialValue) {
      this.setState({ initialSearchValue: initialValue });
    }
    return true;
  }

  componentWillUnmount() {
    clearTimeout(this.blurTimeout);
  }

  setInactive = () => {
    this.setState({ isActive: false, focusedSuggestion: null });
  }

  setSearchbarValue = (value) => {
    this.searchRef.current.value = value;
  }

  keyHandler = (e) => {
    const { focusedSuggestion } = this.state;
    const list = document.getElementsByClassName('suggestionList')[0];
    if (e.keyCode === 40 || e.keyCode === 38) {
      e.preventDefault();
      if (!list || !list.children || !list.children.length) {
        return;
      }
      // TODO: fix calculation on next line when dividers are excluded from lists
      const listEnd = list.querySelectorAll('.suggestion').length - 1;
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
    const search = this.searchRef.current?.value;
    this.handleSubmit(search);
  }

  handleSubmit = (search) => {
    const { changeSelectedUnit, isFetching } = this.props;
    const { focusedSuggestion } = this.state;
    if (isFetching) return;
    let searchQuery;
    if (focusedSuggestion !== null) {
      // Get focused suggestion search string
      const suggestion = document.getElementById(`suggestion${focusedSuggestion}`);
      // Omit search restult count from suggestion string
      searchQuery = suggestion?.getElementsByTagName('p')[0].textContent;
    } else if (search && search !== '') {
      searchQuery = search;
    }
    if (searchQuery) {
      const {
        fetchUnits, navigator, previousSearch,
      } = this.props;
      this.setInactive();

      if (searchQuery !== previousSearch) {
        this.searchRef.current.value = searchQuery; // Change current search text to new one
        fetchUnits({ q: searchQuery });
        changeSelectedUnit(null);
      }

      if (navigator) {
        navigator.push('search', { q: searchQuery });
      }
    }
  }

  handleBlur = () => {
    this.blurTimeout = setTimeout(() => {
      this.setInactive();
      clearTimeout(this.blurTimeout);
    }, this.blurDelay);
  }

  suggestionBackEvent = () => {
    this.setInactive();
  };

  activateSearch = () => {
    this.setState({ focusedSuggestion: null });
    this.setState({ isActive: true });
  }

  renderSuggestionBox = () => {
    const { isActive, focusedSuggestion } = this.state;
    const query = this.searchRef.current?.value || '';
    const searchQuery = query[query.length - 1] === ' ' ? query.slice(0, -1) : query;

    const showSuggestions = isActive;
    if (!showSuggestions) {
      return null;
    }

    return (
      <>
        <Divider aria-hidden />
        {/* TODO: Modify this class to functional component, to use useMobile hook
        instead of individual mobile/desktop components. */}
        <MobileComponent>
          <SuggestionBox
            visible={showSuggestions}
            focusedSuggestion={focusedSuggestion}
            searchQuery={searchQuery}
            handleArrowClick={value => this.setSearchbarValue(value)}
            handleSubmit={this.handleSubmit}
            isMobile
          />
        </MobileComponent>
        <DesktopComponent>
          <SuggestionBox
            visible={showSuggestions}
            focusedSuggestion={focusedSuggestion}
            searchQuery={searchQuery}
            handleArrowClick={value => this.setSearchbarValue(value)}
            handleSubmit={this.handleSubmit}
          />
        </DesktopComponent>
      </>
    );
  }

  renderInput = (isMobile = false) => {
    const { classes, hideBackButton, intl } = this.props;
    const { isActive, focusedSuggestion, initialSearchValue } = this.state;
    const backButtonEvent = isActive && isMobile
      ? () => {
        this.setInactive();
      }
      : null;

    // Style classes
    const backButtonStyles = `${classes.iconButton}`;
    const showSuggestions = isActive;
    const inputHasValue = this.searchRef.current?.value?.length;
    const containerStyles = `${isActive ? classes.containerSticky : classes.containerInactive} ${classes.container}`;
    return (
      <form id="SearchBar" action="" onSubmit={this.onSubmit} className={containerStyles} autoComplete="off">
        {
          (!hideBackButton || (isActive && isMobile))
          && (
            <BackButton
              className={backButtonStyles}
              onClick={backButtonEvent}
              variant="icon"
              srHidden={!!hideBackButton}
            />
          )
        }
        <InputBase
          inputProps={{
            role: 'combobox',
            'aria-haspopup': !!showSuggestions,
            'aria-label': intl.formatMessage({ id: 'search.searchField' }),
            'aria-owns': inputHasValue ? 'SuggestionList' : 'PreviousList',
            'aria-activedescendant': `suggestion${focusedSuggestion}`,
          }}
          type="text"
          inputRef={this.searchRef}
          className={classes.input}
          defaultValue={initialSearchValue || ''}
          classes={{ focused: classes.fieldFocus }}
          onChange={() => this.setState({ focusedSuggestion: null })}
          onFocus={this.activateSearch}
          onKeyDown={e => keyboardHandler(this.keyHandler(e), ['up, down'])}
          onBlur={this.handleBlur}
          endAdornment={
            inputHasValue
              ? (
                <IconButton
                  aria-label={intl.formatMessage({ id: 'search.cancelText' })}
                  className={classes.cancelButton}
                  onClick={() => {
                    if (this.searchRef?.current) {
                      // Clear blur timeout to keep suggestion box active
                      clearTimeout(this.blurTimeout);
                      this.searchRef.current.focus();
                    }
                    this.searchRef.current.value = '';
                  }}
                >
                  <Cancel />
                </IconButton>
              )
              : null
          }
        />

        <Button
          aria-label={intl.formatMessage({ id: 'search' })}
          type="submit"
          className={classes.iconButtonSearch}
          disableRipple
          disableFocusRipple
          classes={{
            label: classes.iconButtonSearchLabel,
            focusVisible: classes.searchButtonFocus,
          }}
          color="secondary"
          variant="contained"
        >
          <Search />
          <Typography variant="caption" color="inherit"><FormattedMessage id="general.search" /></Typography>
        </Button>
      </form>
    );
  }

  renderText = (isMobile = false) => {
    const {
      classes,
    } = this.props;
    const { isActive } = this.state;

    const textClasses = `${classes.infoText} ${isActive && isMobile ? classes.infoTextSticky : ''}`;

    return (
      <Typography align="left" className={textClasses} color="inherit" variant="body2"><FormattedMessage id="search.searchbar.infoText" /></Typography>
    );
  }

  renderHeaderText = (isMobile = false) => {
    const { isActive } = this.state;
    const { classes, header } = this.props;
    if (!header || (isMobile && isActive)) {
      return null;
    }
    return (
      <Typography align="left" className={classes.headerText} variant="h5" component="p" color="inherit"><FormattedMessage id="search.searchbar.headerText" /></Typography>
    );
  }

  renderMobile = () => {
    const {
      background,
      classes,
      className,
      isSticky,
      header,
    } = this.props;
    const { isActive } = this.state;

    const rootClasses = `${
      this.rootClass
    } ${
      isActive ? classes.mobileActiveRoot : classes.root
    } ${
      !isActive && typeof isSticky === 'number' ? classes.sticky : ''
    } ${
      header ? classes.headerBackground : ''
    } ${
      background === 'default' ? classes.background : ''
    }  ${
      className
    }`;
    const wrapperClasses = `${isActive ? classes.mobileWrapper : classes.wrapper}`;
    const stickyStyles = typeof isSticky === 'number' ? { top: isSticky } : null;

    return (
      <>
        <div className={rootClasses} style={stickyStyles}>
          {
            this.renderHeaderText(true)
          }
          <div className={wrapperClasses}>
            {
              this.renderText(true)
            }
            <div className={classes.inputContainer}>
              {
                this.renderInput(true)
              }
              {
                this.renderSuggestionBox()
              }
            </div>
          </div>
        </div>
      </>
    );
  }

  render() {
    const {
      background,
      classes,
      className,
      isSticky,
      header,
      margin,
    } = this.props;

    const rootClasses = `${
      this.rootClass
    } ${
      classes.root
    } ${
      typeof isSticky === 'number' ? classes.sticky : ''
    } ${
      margin ? classes.bottomMargin : ''
    } ${
      header ? classes.headerBackground : ''
    } ${
      background === 'default' ? classes.background : ''
    } ${
      className
    }`;
    const wrapperClasses = classes.wrapper;
    const stickyStyles = typeof isSticky === 'number' ? { top: isSticky } : null;

    return (
      <>
        <MobileComponent>
          {this.renderMobile()}
        </MobileComponent>
        <DesktopComponent>
          <div className={rootClasses} style={stickyStyles}>
            {
              this.renderHeaderText()
            }
            {
              this.renderText()
            }
            <Paper className={wrapperClasses} elevation={1} square>
              {
                this.renderInput()
              }
              {
                this.renderSuggestionBox(true)
              }
            </Paper>
          </div>
        </DesktopComponent>
      </>
    );
  }
}

SearchBar.propTypes = {
  background: PropTypes.oneOf(['default', 'none']),
  changeSelectedUnit: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  className: PropTypes.string,
  fetchUnits: PropTypes.func.isRequired,
  header: PropTypes.bool,
  hideBackButton: PropTypes.bool,
  navigator: PropTypes.objectOf(PropTypes.any),
  initialValue: PropTypes.string,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  isSticky: PropTypes.number,
  isFetching: PropTypes.bool.isRequired,
  previousSearch: PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(PropTypes.any)]),
  margin: PropTypes.bool,
};

SearchBar.defaultProps = {
  background: 'default',
  previousSearch: null,
  className: '',
  header: false,
  hideBackButton: false,
  initialValue: null,
  isSticky: null,
  navigator: null,
  margin: false,
};

export default SearchBar;
