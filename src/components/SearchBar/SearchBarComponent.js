import React, { useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';
import {
  InputBase, Paper, Typography, Button, IconButton, Divider,
} from '@material-ui/core';
import {
  Search, Cancel,
} from '@material-ui/icons';
import { FormattedMessage, useIntl } from 'react-intl';
import BackButton from '../BackButton';
import { keyboardHandler } from '../../utils';
import SuggestionBox from './components/SuggestionBox';
import MobileComponent from '../MobileComponent';
import DesktopComponent from '../DesktopComponent';
import { CloseSuggestionButton } from './components/CloseSuggestionButton';

let blurTimeout = null;

const SearchBarComponent = ({
  background,
  changeSelectedUnit,
  classes,
  className,
  fetchUnits,
  hideBackButton,
  navigator,
  isFetching,
  isSticky,
  header,
  initialValue,
  margin,
  previousSearch,
}) => {
  const blurDelay = 150;
  const rootClass = 'SearchBar';
  const ps = previousSearch
    && !(previousSearch.includes('service_node:') || previousSearch.includes('events:')) ? previousSearch : null;

  const intl = useIntl();

  const [isActive, setIsActive] = useState(false);
  const [initialSearchValue, setInitialSearchValue] = useState(ps || initialValue || '');
  const [focusedSuggestion, setFocusedSuggestion] = useState(null);
  const [updateCount, setUpdateCount] = useState(0);
  const searchRef = useRef();

  useEffect(() => {
    if (initialSearchValue !== initialValue) {
      setInitialSearchValue(initialValue);
    }
  }, [initialValue]);

  useEffect(() => () => {
    clearTimeout(blurTimeout);
  }, []);

  const forceUpdate = () => {
    setUpdateCount(updateCount + 1);
  };

  const setInactive = () => {
    setIsActive(false);
    setFocusedSuggestion(null);
  };

  const setSearchbarValue = (value) => {
    searchRef.current.value = value;
  };

  const handleArrowClick = (value) => {
    setSearchbarValue(value);
    setFocusedSuggestion(null);
  };

  const keyHandler = (e) => {
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

      setFocusedSuggestion(index);
    }
  };

  const handleSubmit = (search) => {
    if (isFetching) return;
    let searchQuery;
    if (focusedSuggestion !== null) {
      // Get focused suggestion search string
      const suggestion = document.getElementById(`suggestion${focusedSuggestion}`);
      if (suggestion?.classList.contains('AreaSuggestion')) {
        suggestion.click();
        return;
      }
      // Omit search restult count from suggestion string
      searchQuery = suggestion?.getElementsByTagName('p')[0].textContent;
    } else if (search && search !== '') {
      searchQuery = search;
    }
    if (searchQuery) {
      setInactive();

      if (searchQuery !== previousSearch) {
        searchRef.current.value = searchQuery; // Change current search text to new one
        fetchUnits({ q: searchQuery });
        changeSelectedUnit(null);
      }

      if (navigator) {
        navigator.push('search', { q: searchQuery });
      }
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const search = searchRef.current?.value;
    handleSubmit(search);
  };

  const handleBlur = () => {
    blurTimeout = setTimeout(() => {
      setInactive();
      clearTimeout(blurTimeout);
    }, blurDelay);
  };

  const activateSearch = () => {
    setIsActive(true);
    setFocusedSuggestion(null);
    setIsActive(true);
  };

  const closeMobileSuggestions = () => {
    setInactive();
    setTimeout(() => {
      const elem = document.getElementById('SearchButton');
      if (elem) {
        elem.focus();
      }
    }, 10);
  };

  const renderSuggestionBox = () => {
    const query = searchRef.current?.value || '';
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
            closeMobileSuggestions={closeMobileSuggestions}
            visible={showSuggestions}
            focusedSuggestion={focusedSuggestion}
            searchQuery={searchQuery}
            handleArrowClick={handleArrowClick}
            handleSubmit={handleSubmit}
            isMobile
          />
          <CloseSuggestionButton
            onClick={closeMobileSuggestions}
            onKeyPress={() => { keyboardHandler(closeMobileSuggestions, ['space', 'enter']); }}
            srOnly
          />
        </MobileComponent>
        <DesktopComponent>
          <SuggestionBox
            visible={showSuggestions}
            focusedSuggestion={focusedSuggestion}
            searchQuery={searchQuery}
            handleArrowClick={handleArrowClick}
            handleSubmit={handleSubmit}
          />
        </DesktopComponent>
      </>
    );
  };

  const renderInput = (isMobile = false) => {
    const backButtonEvent = isActive && isMobile
      ? () => {
        setInactive();
      }
      : null;

    // Style classes
    const backButtonStyles = `${classes.iconButton}`;
    const showSuggestions = isActive;
    const inputHasValue = searchRef.current?.value?.length;
    const listID = inputHasValue ? 'SuggestionList' : 'PreviousList';
    const containerStyles = `${isActive ? classes.containerSticky : classes.containerInactive} ${classes.container}`;
    return (
      <form id="SearchBar" action="" onSubmit={onSubmit} className={containerStyles} autoComplete="off">
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
            'aria-owns': showSuggestions ? listID : null,
            'aria-activedescendant': showSuggestions ? `suggestion${focusedSuggestion}` : null,
          }}
          type="text"
          inputRef={searchRef}
          className={classes.input}
          defaultValue={initialSearchValue || ''}
          classes={{ focused: classes.fieldFocus }}
          onChange={() => {
            if (focusedSuggestion) {
              setFocusedSuggestion(null);
            } else {
              forceUpdate();
            }
          }}
          onFocus={activateSearch}
          onKeyDown={e => keyboardHandler(keyHandler(e), ['up, down'])}
          onBlur={isMobile ? () => {} : handleBlur}
          endAdornment={
            inputHasValue
              ? (
                <IconButton
                  aria-label={intl.formatMessage({ id: 'search.cancelText' })}
                  className={classes.cancelButton}
                  onClick={() => {
                    if (searchRef?.current) {
                      // Clear blur timeout to keep suggestion box active
                      clearTimeout(blurTimeout);
                      searchRef.current.focus();
                    }
                    searchRef.current.value = '';
                  }}
                >
                  <Cancel />
                </IconButton>
              )
              : null
          }
        />

        <Button
          id="SearchButton"
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
  };

  const renderText = (isMobile = false) => {
    const textClasses = `${classes.infoText} ${isActive && isMobile ? classes.infoTextSticky : ''}`;

    return (
      <Typography align="left" className={textClasses} color="inherit" variant="body2"><FormattedMessage id="search.searchbar.infoText" /></Typography>
    );
  };

  const renderHeaderText = (isMobile = false) => {
    if (!header || (isMobile && isActive)) {
      return null;
    }
    return (
      <Typography align="left" className={classes.headerText} variant="h5" component="p" color="inherit"><FormattedMessage id="search.searchbar.headerText" /></Typography>
    );
  };

  const renderMobile = () => {
    const rootClasses = `${
      rootClass
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
    const wrapperClasses = `${isActive ? classes.mobileWrapperActive : classes.mobileWrapper}`;
    const stickyStyles = typeof isSticky === 'number' ? { top: isSticky } : null;

    return (
      <>
        <div className={rootClasses} style={stickyStyles}>
          {
            renderHeaderText(true)
          }
          <div className={wrapperClasses}>
            {
              renderText(true)
            }
            <div className={classes.inputContainer}>
              {
                renderInput(true)
              }
              {
                renderSuggestionBox()
              }
            </div>
          </div>
        </div>
      </>
    );
  };

  const rootClasses = `${
    rootClass
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
        {renderMobile()}
      </MobileComponent>
      <DesktopComponent>
        <div className={rootClasses} style={stickyStyles}>
          {
            renderHeaderText()
          }
          {
            renderText()
          }
          <Paper className={wrapperClasses} elevation={1} square>
            {
              renderInput()
            }
            {
              renderSuggestionBox(true)
            }
          </Paper>
        </div>
      </DesktopComponent>
    </>
  );
};

SearchBarComponent.propTypes = {
  background: PropTypes.oneOf(['default', 'none']),
  changeSelectedUnit: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  className: PropTypes.string,
  fetchUnits: PropTypes.func.isRequired,
  header: PropTypes.bool,
  hideBackButton: PropTypes.bool,
  navigator: PropTypes.objectOf(PropTypes.any),
  initialValue: PropTypes.string,
  isSticky: PropTypes.number,
  isFetching: PropTypes.bool.isRequired,
  previousSearch: PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(PropTypes.any)]),
  margin: PropTypes.bool,
};

SearchBarComponent.defaultProps = {
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

export default SearchBarComponent;
