import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  AppBar, ButtonBase, Container, Toolbar, Typography, useMediaQuery,
} from '@mui/material';
import { Map } from '@mui/icons-material';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { selectNavigator } from '../../redux/selectors/general';
import { getPage, selectThemeMode } from '../../redux/selectors/user';
import DrawerMenu from './DrawerMenu';
import DesktopComponent from '../DesktopComponent';
import MobileComponent from '../MobileComponent';
import ToolMenu from '../ToolMenu';
import { focusToViewTitle } from '../../utils/accessibility';
import { useNavigationParams } from '../../utils/address';
import MenuButton from './MenuButton';
import SMLogo from './SMLogo';
import { isHomePage } from '../../utils/path';
import LanguageMenu from './LanguageMenu';
import { getLocale } from '../../redux/selectors/locale';
import MobileNavButton from './MobileNavButton/MobileNavButton';
import LanguageMenuComponent from './LanguageMenu/LanguageMenuComponent';
import openA11yLink from './util';
import config from '../../../config';

const { topBarHeight, topBarHeightMobile } = config;

const TopBar = (props) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const intl = useIntl();
  const locale = useSelector(getLocale);
  const themeMode = useSelector(selectThemeMode);
  const currentPage = useSelector(getPage);
  const breadcrumb = useSelector(state => state.breadcrumb);
  const navigator = useSelector(selectNavigator);
  const getAddressNavigatorParams = useNavigationParams();
  const isOnHomePage = isHomePage(location?.pathname);

  const {
    hideButtons,
    changeTheme,
    setMapType,
    smallScreen,
  } = props;

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

  const renderMenuButton = pageType => (
    <MenuButton
      pageType={pageType}
      drawerOpen={drawerOpen}
      toggleDrawerMenu={() => toggleDrawerMenu()}
    />
  );

  const handleContrastChange = () => {
    changeTheme(themeMode === 'default' ? 'dark' : 'default');
    setMapType(themeMode === 'default' ? 'accessible_map' : 'servicemap');
  };

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

  const renderDrawerMenu = pageType => (
    <DrawerMenu
      isOpen={drawerOpen}
      pageType={pageType}
      toggleDrawerMenu={() => toggleDrawerMenu()}
      handleNavigation={handleNavigation}
    />
  );

  const renderTopBar = (pageType) => {
    const contrastAriaLabel = intl.formatMessage({ id: `general.contrast.ariaLabel.${themeMode === 'dark' ? 'off' : 'on'}` });

    const topBarLink = (textId, onClick, isCurrent, ariaLabel, linkId) => (
      <ButtonBase sx={{ ml: 3 }} onClick={onClick} aria-current={isCurrent} aria-label={ariaLabel} id={linkId}>
        <Typography><FormattedMessage id={textId} /></Typography>
      </ButtonBase>
    );

    const navigationButton = (textId, onClick, isCurrent, buttonId) => (
      <StyledButton onClick={onClick} aria-current={isCurrent} id={buttonId}>
        <Typography sx={{ color: '#000', fontSize: '1.125rem', fontWeight: 600 }}>
          <FormattedMessage id={textId} />
        </Typography>
      </StyledButton>
    );

    return (
      <>
        <StyledAppBar>
          {/* Toolbar blue area */}
          <DesktopComponent>
            <nav aria-label={intl.formatMessage({ id: 'app.navigation.language' })}>
              <StyledToolbarBlue mobile={+(pageType === 'mobile')}>
                <LanguageMenu mobile={pageType === 'mobile'} />
                {/* Right side links */}
                <Container disableGutters sx={{ justifyContent: 'flex-end', display: 'flex', mr: 0 }}>
                  {topBarLink('general.contrast', () => handleContrastChange(), false, contrastAriaLabel, 'ContrastLink')}
                  {!smallScreen
                    ? (
                      <>
                        {topBarLink('info.statement', () => openA11yLink(locale), false, undefined, 'AccessibilityStatementLink')}
                        {topBarLink('general.pageTitles.info', () => handleNavigation('info'), currentPage === 'info', undefined, 'PageInfoLink')}
                        {topBarLink('home.send.feedback', () => handleNavigation('feedback'), currentPage === 'feedback', undefined, 'FeedbackLink')}
                      </>
                    )
                    : null
                  }
                </Container>
              </StyledToolbarBlue>
            </nav>
          </DesktopComponent>

          {/* Toolbar white area */}
          <StyledToolbarWhite disableGutters mobile={+(pageType === 'mobile')}>
            <SMLogo small={!large} onClick={() => handleNavigation('home')} />
            {hideButtons
              ? null
              : (
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
                        <StyledNavigationButtonsContainer>
                          {navigationButton('general.frontPage', () => handleNavigation('home'), currentPage === 'home', 'HomePage')}
                          {navigationButton('general.pageLink.area', () => handleNavigation('area'), currentPage === 'area', 'AreaPage')}
                          {navigationButton('services', () => handleNavigation('services'), currentPage === 'services', 'ServicePage')}
                          {navigationButton('general.pageLink.mobilityTree', () => handleNavigation('mobilityTree'), currentPage === 'mobilityTree', 'MobilityPage')}
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
                    {
                      !smallScreen && (
                        <ToolMenu />
                      )
                    }
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
        <>
          {renderTopBar('mobile')}
        </>
      </MobileComponent>
      <DesktopComponent>
        <>
          {renderTopBar('desktop')}
        </>
      </DesktopComponent>
    </>
  );
};
const StyledNav = styled('nav')(() => ({
  display: 'flex',
  flex: '1 1 auto',
  height: '100%',
}));
const StyledNavigationButtonsContainer = styled('div')(({ theme }) => ({
  paddingLeft: 88 + parseInt(theme.spacing(2.5), 10),
  display: 'flex',
  flex: '1 1 auto',
}));
const StyledMobileButtonContainer = styled('div')(() => ({
  display: 'flex',
  marginLeft: 'auto',
  width: 223,
  justifyContent: 'flex-end',
}));

const StyledButton = styled(ButtonBase)(({ theme }) => ({
  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2.5),
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
const StyledToolbarWhite = styled(Toolbar)(({ theme, mobile }) => (
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
));

TopBar.propTypes = {
  changeTheme: PropTypes.func.isRequired,
  setMapType: PropTypes.func.isRequired,
  smallScreen: PropTypes.bool.isRequired,
  hideButtons: PropTypes.bool,
};

TopBar.defaultProps = {
  hideButtons: false,
};

export default TopBar;
