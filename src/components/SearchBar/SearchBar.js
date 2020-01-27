import React from 'react';

import PropTypes from 'prop-types';
import {
  InputBase, Paper, Typography, Button, IconButton, Divider,
} from '@material-ui/core';
import {
  Search, Cancel,
} from '@material-ui/icons';
import { intlShape, FormattedMessage } from 'react-intl';
import BackButton from '../BackButton';
import { keyboardHandler } from '../../utils';
import SuggestionBox from './components/SuggestionBox';
import { DesktopComponent, MobileComponent } from '../../layouts/WrapperComponents/WrapperComponents';

class SearchBar extends React.Component {
  blurDelay = 150;

  blurTimeout = null;

  searchRef = null;

  constructor(props) {
    super(props);
    const { initialValue, previousSearch } = props;

    this.searchRef = React.createRef();

    this.state = {
      search: previousSearch || initialValue || '',
      searchQuery: '',
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

  setInactive = () => {
    this.setState({ isActive: false, focusedSuggestion: null });
  }

  onInputChange = (e) => {
    const query = typeof e === 'string' ? e : e.currentTarget.value;
    const searchQuery = query[query.length - 1] === ' ' ? query.slice(0, -1) : query;
    this.setState({ search: query, focusedSuggestion: null, searchQuery });
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
    const { search } = this.state;
    this.handleSubmit(search);
  }

  handleSubmit = (search) => {
    const { isFetching } = this.props;
    if (!isFetching && search && search !== '') {
      const {
        fetchUnits, navigator, previousSearch,
      } = this.props;
      this.setInactive();

      if (search !== previousSearch) {
        this.setState({ search }); // Change current search text to new one
        fetchUnits({ q: search });
      }

      if (navigator) {
        navigator.push('search', { q: search });
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
    const { search } = this.state;
    if (search) {
      this.onInputChange(search);
    }
    this.setState({ isActive: true });
  }

  renderSuggestionBox = () => {
    const { searchQuery, isActive, focusedSuggestion } = this.state;

    const showSuggestions = isActive;
    if (!showSuggestions) {
      return null;
    }

    return (
      <>
        <Divider aria-hidden />
        <SuggestionBox
          visible={showSuggestions}
          focusedSuggestion={focusedSuggestion}
          searchQuery={searchQuery}
          handleArrowClick={value => this.onInputChange(value)}
          handleSubmit={this.handleSubmit}
          setSearch={value => this.setState({ search: value })}
          isMobile
        />
      </>
    );
  }

  renderInput = (isMobile = false) => {
    const {
      classes,
      hideBackButton,
      intl,
      previousSearch,
    } = this.props;
    const { search, isActive } = this.state;

    const previousSearchText = typeof previousSearch === 'string' ? previousSearch : null;
    const backButtonEvent = isActive && isMobile
      ? () => {
        this.setInactive();
      }
      : null;

    // Style classes
    const backButtonStyles = `${classes.iconButton}`;
    const showSuggestions = isActive;
    let inputValue = typeof search === 'string' ? search : previousSearchText;
    if (inputValue.includes('service_node')) {
      inputValue = null;
    }
    const containerStyles = `${isActive ? classes.containerSticky : classes.containerInactive} ${classes.container}`;

    return (
      <form onSubmit={this.onSubmit} className={containerStyles} autoComplete="off">
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
            type: 'text',
            'aria-haspopup': !!showSuggestions,
            'aria-label': intl.formatMessage({ id: 'search.searchField' }),
          }}
          inputRef={(ref) => { this.searchRef = ref; }}
          className={classes.input}
          value={inputValue || ''}
          onChange={this.onInputChange}
          onFocus={this.activateSearch}
          onKeyDown={e => keyboardHandler(this.keyHandler(e), ['up, down'])}
          onBlur={this.handleBlur}
          endAdornment={
            inputValue
            && inputValue !== ''
            && (
              <IconButton
                aria-label={intl.formatMessage({ id: 'search.cancelText' })}
                className={classes.cancelButton}
                onClick={() => {
                  if (this.searchRef) {
                    // Clear blur timeout to keep suggestion box active
                    clearTimeout(this.blurTimeout);
                    this.searchRef.focus();
                  }
                  this.setState({ search: '', searchQuery: '' });
                }}
              >
                <Cancel />
              </IconButton>
            )
          }
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
      srHideInput,
    } = this.props;
    const { isActive } = this.state;

    const rootClasses = `${
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
        <div aria-hidden={srHideInput} className={rootClasses} style={stickyStyles}>
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
      srHideInput,
      margin,
    } = this.props;

    const rootClasses = `${
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
          <div aria-hidden={srHideInput} className={rootClasses} style={stickyStyles}>
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
  background: PropTypes.oneOf(['default', 'none']),
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
  previousSearch: PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(PropTypes.any)]),
  srHideInput: PropTypes.bool,
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
  srHideInput: false,
  margin: false,
};

export default SearchBar;
