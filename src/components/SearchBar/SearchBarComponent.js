import { css } from '@emotion/css';
import styled from '@emotion/styled';
import { Cancel, Search } from '@mui/icons-material';
import {
  ButtonBase,
  Divider,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';

import paths from '../../../config/paths';
import fetchSearchResults from '../../redux/actions/search';
import { changeSelectedUnit } from '../../redux/actions/selectedUnit';
import { selectNavigator } from '../../redux/selectors/general';
import {
  selectResultsIsFetching,
  selectResultsPreviousSearch,
} from '../../redux/selectors/results';
import { keyboardHandler, uppercaseFirst, useQuery } from '../../utils';
import useLocaleText from '../../utils/useLocaleText';
import BackButton from '../BackButton';
import DesktopComponent from '../DesktopComponent';
import MobileComponent from '../MobileComponent';
import { CloseSuggestionButton } from './components/CloseSuggestionButton';
import SuggestionBox from './components/SuggestionBox';
import { getFullHistory } from './previousSearchData';

let blurTimeout = null;

function SearchBar({
  background = 'default',
  className = '',
  hideBackButton = false,
  isSticky = null,
  header = false,
  margin = false,
}) {
  const blurDelay = 150;
  const rootClass = 'SearchBar';

  const intl = useIntl();

  const [isActive, setIsActive] = useState(false);
  const [focusedSuggestion, setFocusedSuggestion] = useState(null);
  const [updateCount, setUpdateCount] = useState(0);
  const getLocaleText = useLocaleText();
  const location = useLocation();
  const queryParams = useQuery();
  const searchRef = useRef();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigator = useSelector(selectNavigator);
  const isFetching = useSelector(selectResultsIsFetching);
  const previousSearch = useSelector(selectResultsPreviousSearch);

  const setSearchbarValue = (value) => {
    searchRef.current.value = value;
  };

  useEffect(
    () => () => {
      // Unmount
      clearTimeout(blurTimeout);
    },
    []
  );

  useEffect(() => {
    // If mounting search page show correct search text in searchbar
    const isSearchPage = paths.search.regex.test(location.pathname);
    if (isSearchPage) {
      if (queryParams.q) {
        setSearchbarValue(queryParams.q);
        return;
      }

      const history = getFullHistory();
      if (!history) return;

      // Get correct history item by comparing url params to search history entries
      const historyItem = history.find((item) => {
        if (queryParams.address) {
          return (
            item.object_type === 'address' &&
            getLocaleText(item.name) === queryParams.address
          );
        }
        if (queryParams.service_id) {
          return (
            item.object_type === 'service' &&
            item.id.toString() === queryParams.service_id
          );
        }
        if (queryParams.service_node) {
          return (
            item.object_type === 'servicenode' &&
            item.ids.toString() === queryParams.service_node
          );
        }
        return null;
      });

      if (historyItem) {
        let text = historyItem.name
          ? getLocaleText(historyItem.name)
          : historyItem.searchText;
        if (queryParams.address) {
          // Remove extra text from address suggestion text
          [text] = text.split(',');
        }
        setSearchbarValue(uppercaseFirst(text));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  const forceUpdate = () => {
    setUpdateCount(updateCount + 1);
  };

  const setInactive = () => {
    setIsActive(false);
    setFocusedSuggestion(null);
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
      const suggestion = document.getElementById(
        `suggestion${focusedSuggestion}`
      );
      if (!document.querySelector('#PreviousList')) {
        suggestion.click();
        return;
      }
      searchQuery = suggestion?.getElementsByTagName('p')[0].textContent;
    }
    if (search && search !== '') {
      searchQuery = search;
    }
    if (searchQuery) {
      setInactive();

      if (searchQuery !== previousSearch) {
        setSearchbarValue(searchQuery); // Change current search text to new one
        dispatch(fetchSearchResults({ q: searchQuery }));
        dispatch(changeSelectedUnit(null));
      }

      if (navigator) {
        // Encode searchQuery to handle special characters in the URL
        navigator.push('search', { q: encodeURIComponent(searchQuery) });
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
    // Fix problem with iOS keyboard pushing content outside of view
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
    }, 100);
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
    const searchQuery =
      query[query.length - 1] === ' ' ? query.slice(0, -1) : query;

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
            handleBlur={handleBlur}
            isMobile
          />
          <CloseSuggestionButton
            onClick={closeMobileSuggestions}
            onKeyPress={() => {
              keyboardHandler(closeMobileSuggestions, ['space', 'enter']);
            }}
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
            handleBlur={handleBlur}
          />
        </DesktopComponent>
      </>
    );
  };

  const renderInput = (isMobile = false) => {
    const backButtonEvent =
      isActive && isMobile
        ? () => {
            setInactive();
          }
        : null;

    // Style classes
    const showSuggestions = isActive;
    const inputHasValue = searchRef.current?.value?.length;
    const listID = inputHasValue ? 'SuggestionList' : 'PreviousList';
    const focusedClass = css({
      outline: '2px solid transparent',
      boxShadow: `inset 0 0 0 4px ${theme.palette.focusBorder.main}`,
    });

    return (
      <StyledForm
        id="SearchBar"
        action=""
        onSubmit={onSubmit}
        isactive={isActive || undefined}
        autoComplete="off"
      >
        {(!hideBackButton || (isActive && isMobile)) && (
          <StyledBackButton
            onClick={backButtonEvent}
            variant="icon"
            srHidden={!!hideBackButton}
          />
        )}
        <StyledInputBase
          inputProps={{
            role: 'combobox',
            'aria-haspopup': !!showSuggestions,
            'aria-owns': showSuggestions ? listID : null,
            'aria-activedescendant': showSuggestions
              ? `suggestion${focusedSuggestion}`
              : null,
          }}
          id="search-bar"
          type="text"
          inputRef={searchRef}
          classes={{ focused: focusedClass }}
          onChange={() => {
            if (focusedSuggestion) {
              setFocusedSuggestion(null);
            } else {
              forceUpdate();
            }
          }}
          onFocus={activateSearch}
          onKeyDown={(e) => keyboardHandler(keyHandler(e), ['up, down'])}
          onBlur={isMobile ? () => {} : handleBlur}
          endAdornment={
            inputHasValue ? (
              <StyledIconButton
                aria-label={intl.formatMessage({ id: 'search.cancelText' })}
                onClick={() => {
                  if (searchRef?.current) {
                    // Clear blur timeout to keep suggestion box active
                    clearTimeout(blurTimeout);
                    searchRef.current.focus();
                  }
                  setSearchbarValue('');
                }}
              >
                <Cancel />
              </StyledIconButton>
            ) : null
          }
        />

        <StyledSearchButton
          id="SearchButton"
          aria-label={intl.formatMessage({ id: 'search' })}
          type="submit"
          color="secondary"
          variant="contained"
        >
          <Typography>
            <FormattedMessage id="general.search" />
          </Typography>
          <Search />
        </StyledSearchButton>
      </StyledForm>
    );
  };

  const renderText = (isMobile = false) => (
    <label htmlFor="search-bar">
      <StyledInfoText
        align="left"
        sticky={(isActive && isMobile) || undefined}
        color="inherit"
        variant="body2"
      >
        <FormattedMessage id="search.searchbar.infoText" />
      </StyledInfoText>
    </label>
  );

  const renderHeaderText = (isMobile = false) => {
    if (!header || (isMobile && isActive)) {
      return null;
    }
    return (
      <StyledHeaderText align="left" variant="h5" component="p" color="inherit">
        <FormattedMessage id="search.searchbar.headerText" />
      </StyledHeaderText>
    );
  };

  const renderMobile = () => {
    const rootClasses = `${rootClass} ${className}`;
    const stickyStyles =
      typeof isSticky === 'number' ? { top: isSticky } : null;

    return (
      <StyledMobileContainer
        className={rootClasses}
        isactive={isActive || undefined}
        sticky={typeof isSticky === 'number' || undefined}
        header={header || undefined}
        background={background === 'default' || undefined}
        style={stickyStyles}
      >
        {renderHeaderText(true)}
        <StyledMobileWrapper isactive={isActive || undefined}>
          {renderText(true)}
          <StyledInputContainer>
            {renderInput(true)}
            {renderSuggestionBox()}
          </StyledInputContainer>
        </StyledMobileWrapper>
      </StyledMobileContainer>
    );
  };

  const rootClasses = `${rootClass} ${className}`;
  const stickyStyles = typeof isSticky === 'number' ? { top: isSticky } : null;

  return (
    <>
      <MobileComponent>{renderMobile()}</MobileComponent>
      <DesktopComponent>
        <StyledDesktopContainer
          className={rootClasses}
          style={stickyStyles}
          sticky={typeof isSticky === 'number' || undefined}
          margin={margin || undefined}
          header={header || undefined}
          background={background === 'default' || undefined}
        >
          {renderHeaderText()}
          {renderText()}
          <StyledPaper elevation={1} square>
            {renderInput()}
            {renderSuggestionBox(true)}
          </StyledPaper>
        </StyledDesktopContainer>
      </DesktopComponent>
    </>
  );
}

const StyledMobileWrapper = styled('div')(({ isactive }) =>
  isactive
    ? {
        flex: '0 1 auto',
        display: 'flex',
        flexDirection: 'column',
      }
    : {
        flex: '0 1 auto',
        borderRadius: '4px',
      }
);

const StyledInputContainer = styled('div')(({ theme }) => ({
  backgroundColor: '#fff',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(0.5),
}));

const StyledPaper = styled(Paper)(() => ({
  position: 'relative',
  flex: '0 1 auto',
  borderRadius: '4px',
}));

const StyledDesktopContainer = styled('div')(({
  theme,
  sticky,
  margin,
  header,
  background,
}) => {
  const styles = {
    color: theme.palette.primary.highContrast,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    boxShadow: '0 2px 2px 0 rgba(0,0,0,0.5)',
    flex: '0 0 auto',
  };
  if (sticky) {
    Object.assign(styles, {
      position: 'sticky',
      zIndex: theme.zIndex.sticky,
    });
  }
  if (margin) {
    Object.assign(styles, {
      marginBottom: 4,
    });
  }
  if (header) {
    Object.assign(styles, {
      background: theme.palette.primary.main,
    });
  }
  if (background) {
    Object.assign(styles, {
      background: theme.palette.primary.main,
    });
  }
  return styles;
});

const StyledBackButton = styled(BackButton)(({ theme }) => ({
  flex: '0 1 auto',
  padding: theme.spacing(1),
  margin: theme.spacing(0.5),
}));

const StyledForm = styled('form')(({ theme, isactive }) => {
  const styles = isactive
    ? {
        position: 'sticky',
        top: 35,
        zIndex: theme.zIndex.infront,
      }
    : {
        borderRadius: theme.spacing(0.5),
      };
  Object.assign(styles, {
    alignItems: 'center',
    display: 'flex',
    height: 54,
    flex: '0 0 auto',
    backgroundColor: '#fff',
    border: '1px solid #ACACAC',
    borderTopLeftRadius: theme.spacing(0.5),
    borderTopRightRadius: theme.spacing(0.5),
  });
  return styles;
});

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  flex: '1 1 auto',
  paddingLeft: theme.spacing(0.5),
  paddingRight: theme.spacing(0.5),
  marginLeft: theme.spacing(0.5),
  marginRight: theme.spacing(0.5),
}));

const StyledIconButton = styled(IconButton)(() => ({
  '& svg': {
    fontSize: '0.875rem',
  },
}));

const StyledSearchButton = styled(ButtonBase)(({ theme }) => ({
  flex: '0 0 auto',
  width: 87,
  height: '100%',
  borderRadius: 0,
  borderTopRightRadius: 4,
  borderBottomRightRadius: 4,
  boxShadow: 'none',
  padding: theme.spacing(0.5, 0),
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  display: 'flex',
  flexDirection: 'row',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'rgb(30, 32, 39)',
    transition: '0.5s',
  },
  '& svg': {
    fontSize: 24,
    paddingLeft: theme.spacing(0.5),
  },
}));

const StyledInfoText = styled(Typography)(({ theme, sticky }) => {
  const styles = {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(0.5),
  };
  if (sticky) {
    Object.assign(styles, {
      backgroundColor: theme.palette.primary.main,
      position: 'sticky',
      top: 0,
      zIndex: theme.zIndex.sticky,
      paddingTop: theme.spacing(2),
    });
  }
  return styles;
});

const StyledHeaderText = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  margin: theme.spacing(2, 0, 1, 0),
}));

const StyledMobileContainer = styled('div')(({
  theme,
  isactive,
  sticky,
  header,
  background,
}) => {
  const styles = isactive
    ? {
        color: theme.palette.primary.highContrast,
        padding: theme.spacing(1),
        paddingTop: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        position: 'fixed',
        zIndex: theme.zIndex.modal,
        overflow: 'auto',
      }
    : {
        color: theme.palette.primary.highContrast,
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2),
        boxShadow: '0 2px 2px 0 rgba(0,0,0,0.5)',
        flex: '0 0 auto',
      };
  if (!isactive && sticky) {
    Object.assign(styles, {
      position: 'sticky',
      zIndex: theme.zIndex.sticky,
    });
  }
  if (header) {
    Object.assign(styles, {
      background: theme.palette.primary.main,
    });
  }
  if (background) {
    Object.assign(styles, {
      background: theme.palette.primary.main,
    });
  }
  return styles;
});

SearchBar.propTypes = {
  background: PropTypes.oneOf(['default', 'none']),
  className: PropTypes.string,
  header: PropTypes.bool,
  hideBackButton: PropTypes.bool,
  isSticky: PropTypes.number,
  margin: PropTypes.bool,
};

export default SearchBar;
