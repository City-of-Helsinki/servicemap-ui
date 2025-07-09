import styled from '@emotion/styled';
import { Map } from '@mui/icons-material';
import {
  AppBar,
  ButtonBase,
  Container,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import config from '../../../config';
import { setMapType } from '../../redux/actions/settings';
import { changeTheme } from '../../redux/actions/user';
import {
  selectBreadcrumb,
  selectNavigator,
} from '../../redux/selectors/general';
import {
  getLocale,
  getPage,
  selectThemeMode,
} from '../../redux/selectors/user';
import { focusToViewTitle } from '../../utils/accessibility';
import { useNavigationParams } from '../../utils/address';
import { isHomePage } from '../../utils/path';
import SettingsUtility from '../../utils/settings';
import DesktopComponent from '../DesktopComponent';
import MobileComponent from '../MobileComponent';
import ToolMenu from '../ToolMenu';
import DrawerMenu from './DrawerMenu';
import LanguageMenu from './LanguageMenu';
import LanguageMenuComponent from './LanguageMenu/LanguageMenuComponent';
import MenuButton from './MenuButton';
import MobileNavButton from './MobileNavButton/MobileNavButton';
import SMLogo from './SMLogo';
import openA11yLink from './util';

const { topBarHeight, topBarHeightMobile, smallWidthForTopBarBreakpoint } =
  config;

function TopBar(props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const intl = useIntl();
  const locale = useSelector(getLocale);
  const themeMode = useSelector(selectThemeMode);
  const currentPage = useSelector(getPage);
  const breadcrumb = useSelector(selectBreadcrumb);
  const navigator = useSelector(selectNavigator);
  // medium - because i can't name things
  const isMediumScreen = useMediaQuery(
    `(max-width:${smallWidthForTopBarBreakpoint}px)`
  );
  const getAddressNavigatorParams = useNavigationParams();
  const isOnHomePage = isHomePage(location?.pathname);

  const { hideButtons = false, smallScreen } = props;

  const renderMapButton = () => {
    const mapPage = location.search.indexOf('showMap=true') > -1;
    const textId = mapPage ? 'map.close' : 'map.open';
    return (
      <MobileNavButton
        aria-current={mapPage ? 'page' : false}
        aria-hidden
        icon={<Map />}
        text={<FormattedMessage id={textId} />}
        onClick={(e) => {
          e.preventDefault();
          if (mapPage) {
            navigator.closeMap(breadcrumb.length ? 'replace' : null);
          } else {
            navigator.openMap();
          }
        }}
      />
    );
  };

  const toggleDrawerMenu = () => {
    setTimeout(() => {
      setDrawerOpen(!drawerOpen);
    }, 1);
  };

  const renderMenuButton = (pageType) => (
    <MenuButton
      pageType={pageType}
      drawerOpen={drawerOpen}
      toggleDrawerMenu={() => toggleDrawerMenu()}
    />
  );

  const handleContrastChange = () => {
    const defaultTheme = themeMode === 'default';
    const newTheme = defaultTheme ? 'dark' : 'default';
    const newMapType = defaultTheme
      ? 'accessible_map'
      : SettingsUtility.defaultMapType;

    localStorage.setItem('theme', newTheme);

    dispatch(changeTheme(newTheme));
    dispatch(setMapType(newMapType));
  };

  // Retrieve the theme from local storage when the app is loaded
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      dispatch(changeTheme(savedTheme));
    }
  }, []);

  const handleNavigation = (target, data) => {
    // Hide settings and map if open
    if (location.search.indexOf('showMap=true') > -1) {
      navigator.closeMap();
    }

    if (currentPage === target) return;

    switch (target) {
      case 'home':
        if (!isOnHomePage) {
          navigator.push('home');
        } else {
          setTimeout(() => {
            focusToViewTitle();
          }, 1);
        }
        break;

      case 'address':
        navigator.push('address', getAddressNavigatorParams(data));
        break;

      case 'services':
        if (currentPage !== 'serviceTree') {
          navigator.push('serviceTree');
        }
        break;

      case 'mobilityTree':
        navigator.push('mobilityTree');
        break;

      case 'area':
        navigator.push('area');
        break;

      case 'feedback':
        navigator.push('feedback');
        break;

      case 'info':
        navigator.push('info');
        break;

      default:
        break;
    }
  };

  const large = useMediaQuery('(min-width:360px)');

  const renderDrawerMenu = (pageType) => (
    <DrawerMenu
      isOpen={drawerOpen}
      pageType={pageType}
      toggleDrawerMenu={() => toggleDrawerMenu()}
      handleNavigation={handleNavigation}
    />
  );

  const renderTopBar = (pageType) => {
    const contrastAriaLabel = intl.formatMessage({
      id: `general.contrast.ariaLabel.${themeMode === 'dark' ? 'off' : 'on'}`,
    });

    const topBarLink = (textId, onClick, isCurrent, ariaLabel, linkId) => (
      <ButtonBase
        sx={{ ml: 3 }}
        onClick={onClick}
        aria-current={isCurrent}
        aria-label={ariaLabel}
        id={linkId}
      >
        <Typography>
          <FormattedMessage id={textId} />
        </Typography>
      </ButtonBase>
    );

    const navigationButton = (textId, onClick, isCurrent, buttonId) => (
      <StyledButton
        onClick={onClick}
        aria-current={isCurrent}
        id={buttonId}
        medium={+isMediumScreen}
      >
        <Typography
          sx={{ color: '#000', fontSize: '1.125rem', fontWeight: 600 }}
        >
          <FormattedMessage id={textId} />
        </Typography>
      </StyledButton>
    );

    return (
      <>
        <StyledAppBar>
          {/* Toolbar blue area */}
          <DesktopComponent>
            <nav
              aria-label={intl.formatMessage({ id: 'app.navigation.language' })}
            >
              <StyledToolbarBlue mobile={+(pageType === 'mobile')}>
                <LanguageMenu mobile={pageType === 'mobile'} />
                {/* Right side links */}
                <Container
                  disableGutters
                  sx={{ justifyContent: 'flex-end', display: 'flex', mr: 0 }}
                >
                  {topBarLink(
                    'general.contrast',
                    () => handleContrastChange(),
                    false,
                    contrastAriaLabel,
                    'ContrastLink'
                  )}
                  {!smallScreen ? (
                    <>
                      {topBarLink(
                        'info.statement',
                        () => openA11yLink(locale),
                        false,
                        undefined,
                        'AccessibilityStatementLink'
                      )}
                      {topBarLink(
                        'general.pageTitles.info',
                        () => handleNavigation('info'),
                        currentPage === 'info',
                        undefined,
                        'PageInfoLink'
                      )}
                      {topBarLink(
                        'home.send.feedback',
                        () => handleNavigation('feedback'),
                        currentPage === 'feedback',
                        undefined,
                        'FeedbackLink'
                      )}
                    </>
                  ) : null}
                </Container>
              </StyledToolbarBlue>
            </nav>
          </DesktopComponent>

          {/* Toolbar white area */}
          <StyledToolbarWhite disableGutters mobile={+(pageType === 'mobile')}>
            <SMLogo small={!large} onClick={() => handleNavigation('home')} />
            {hideButtons ? null : (
              <>
                <MobileComponent>
                  <StyledMobileButtonContainer>
                    <LanguageMenuComponent mobile />
                    {renderMapButton()}
                    {renderMenuButton(pageType)}
                  </StyledMobileButtonContainer>
                  {renderDrawerMenu(pageType)}
                </MobileComponent>
                <DesktopComponent>
                  <StyledNav>
                    {!smallScreen ? (
                      <StyledNavigationButtonsContainer
                        medium={+isMediumScreen}
                      >
                        {navigationButton(
                          'general.frontPage',
                          () => handleNavigation('home'),
                          currentPage === 'home',
                          'HomePage'
                        )}
                        {navigationButton(
                          'general.pageLink.area',
                          () => handleNavigation('area'),
                          currentPage === 'area',
                          'AreaPage'
                        )}
                        {navigationButton(
                          'services',
                          () => handleNavigation('services'),
                          currentPage === 'services',
                          'ServicePage'
                        )}
                        {navigationButton(
                          'general.pageLink.mobilityTree',
                          () => handleNavigation('mobilityTree'),
                          currentPage === 'mobilityTree',
                          'MobilityPage'
                        )}
                      </StyledNavigationButtonsContainer>
                    ) : (
                      <>
                        <StyledMobileButtonContainer>
                          {renderMenuButton()}
                        </StyledMobileButtonContainer>
                        {renderDrawerMenu(pageType)}
                      </>
                    )}
                  </StyledNav>
                  {!smallScreen && <ToolMenu />}
                </DesktopComponent>
              </>
            )}
          </StyledToolbarWhite>
        </StyledAppBar>
        {/* This empty toolbar fixes the issue where App bar hides the top page content */}
        <StyledToolbarAligner mobile={+(pageType === 'mobile')} />
      </>
    );
  };

  return (
    <>
      <MobileComponent>
        <>{renderTopBar('mobile')}</>
      </MobileComponent>
      <DesktopComponent>
        <>{renderTopBar('desktop')}</>
      </DesktopComponent>
    </>
  );
}
const StyledNav = styled('nav')(() => ({
  display: 'flex',
  flex: '1 1 auto',
  height: '100%',
}));
const StyledNavigationButtonsContainer = styled('div')(({ theme, medium }) => ({
  paddingLeft: (medium ? 0 : 88) + parseInt(theme.spacing(2.5), 10),
  display: 'flex',
  flex: '1 1 auto',
}));
const StyledMobileButtonContainer = styled('div')(() => ({
  display: 'flex',
  marginLeft: 'auto',
  width: 223,
  justifyContent: 'flex-end',
}));

const StyledButton = styled(ButtonBase)(({ theme, medium }) => ({
  paddingLeft: theme.spacing(1.5 + (medium ? 0 : 1)),
  paddingRight: theme.spacing(1.5 + (medium ? 0 : 1)),
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
}));
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.appBar,
}));
const StyledToolbarAligner = styled(Toolbar)(({ mobile }) => ({
  height: mobile ? topBarHeightMobile : topBarHeight,
}));
const StyledToolbarBlue = styled(Toolbar)(({ theme, mobile }) => {
  const styles = {
    // override breakpoints
    [theme.breakpoints.up('xs')]: {
      minHeight: 32,
      height: 32,
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    minHeight: 32,
    height: 32,
    backgroundColor: theme.palette.primary.main,
    padding: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  };
  if (mobile) {
    Object.assign(styles, {
      paddingLeft: 14,
      paddingRight: 14,
    });
  }
  return styles;
});
const StyledToolbarWhite = styled(Toolbar)(({ theme, mobile }) =>
  mobile
    ? {
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        paddingLeft: theme.spacing(1.5),
        height: 78,
        backgroundColor: '#fff',
      }
    : {
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: theme.spacing(3),
        height: 60,
        backgroundColor: '#fff',
        zIndex: theme.zIndex.infront,
      }
);

TopBar.propTypes = {
  smallScreen: PropTypes.bool.isRequired,
  hideButtons: PropTypes.bool,
};

export default TopBar;
