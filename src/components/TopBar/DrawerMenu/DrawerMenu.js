import React from 'react';
import PropTypes from 'prop-types';
import {
  ButtonBase,
  Divider,
  Drawer,
  Typography,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import styled from '@emotion/styled';
import { css } from '@emotion/css';
import { useTheme } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { getTheme as getThemeMode, getPage } from '../../../redux/selectors/user';
import { changeTheme } from '../../../redux/actions/user';
import openA11yLink from '../util';
import { getLocale } from '../../../redux/selectors/locale';
import config from '../../../../config';

const { topBarHeight, topBarHeightMobile } = config;

const DrawerMenu = (props) => {
  const {
    pageType,
    isOpen,
    toggleDrawerMenu,
    handleNavigation,
  } = props;
  const dispatch = useDispatch();
  const currentPage = useSelector(getPage);
  const locale = useSelector(getLocale);
  const themeMode = useSelector(getThemeMode);
  const theme = useTheme();


  const menuMainButton = (headerId, textId, pageId) => (
    <StyledButtonBase
      aria-current={currentPage === pageId}
      role="link"
      onClick={() => {
        toggleDrawerMenu();
        handleNavigation(pageId);
      }}
    >
      <StyledTextContainer>
        <StyledTitle><FormattedMessage id={headerId} /></StyledTitle>
        <Typography sx={{ color: '#666', fontSize: '0.913rem', lineHeight: '1.5rem' }}>
          <FormattedMessage id={textId} />
        </Typography>
      </StyledTextContainer>
      <ArrowForward sx={{ fontSize: '2.5rem', ml: 'auto' }} />
    </StyledButtonBase>
  );

  const menuSecondaryButton = (headerId, pageId, handleClick, isLink, buttonId) => (
    <StyledButtonBase
      id={buttonId}
      sx={{ backgroundColor: 'rgba(167, 200, 232, 0.15)' }}
      aria-current={pageId && currentPage === pageId}
      role={isLink ? 'link' : 'button'}
      onClick={handleClick || (() => {
        toggleDrawerMenu();
        handleNavigation(pageId);
      })}
    >
      <StyledTextContainer>
        <StyledTitle><FormattedMessage id={headerId} /></StyledTitle>
      </StyledTextContainer>
    </StyledButtonBase>
  );
  const drawerContainerClass = css({
    top: topBarHeight,
    backgroundColor: '#fff',
    width: '100%',
    overflow: 'visible',
    zIndex: theme.zIndex.infront,
  });
  const drawerContainerMobileClass = css({
    top: topBarHeightMobile,
    backgroundColor: '#fff',
    width: '100%',
    overflow: 'visible',
    zIndex: theme.zIndex.behind,
  });

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={isOpen}
      classes={{ paper: pageType === 'mobile' ? drawerContainerMobileClass : drawerContainerClass }}
      PaperProps={{ sx: { top: `${pageType === 'mobile' ? topBarHeightMobile : topBarHeight}px` } }}
    >
      <StyledScrollContainer>
        {/* Main links */}
        {menuMainButton('general.frontPage', 'app.description', 'home')}
        <Divider />
        {menuMainButton('general.pageLink.area', 'home.buttons.area', 'area')}
        <Divider />
        {menuMainButton('services', 'home.buttons.services', 'services')}
        <Divider />
        {menuMainButton('general.pageLink.mobility', 'home.buttons.mobility', 'mobility')}
        <Divider />

        {/* Smaller buttons  */}
        {menuSecondaryButton(
          themeMode === 'default'
            ? 'general.contrast.ariaLabel.on'
            : 'general.contrast.ariaLabel.off',
          null,
          () => dispatch(changeTheme(themeMode === 'default' ? 'dark' : 'default')),
          false,
          'ContrastButton',
        )}
        <Divider />
        {menuSecondaryButton('info.statement', 'accessibilityStatement', () => openA11yLink(locale), true, 'AccessibilityStatementButton')}
        <Divider />
        {menuSecondaryButton('home.send.feedback', 'feedback', null, true, 'FeedbackButton')}
        <Divider />
        {menuSecondaryButton('general.pageTitles.info', 'info', null, true, 'PageInfoButton')}
      </StyledScrollContainer>
    </Drawer>
  );
};

const StyledButtonBase = styled(ButtonBase)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(1.5),
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  justifyContent: 'flex-start',
}));

const StyledTextContainer = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  textAlign: 'left',
  paddingRight: theme.spacing(2),
}));

const StyledTitle = styled(Typography)(() => ({
  fontSize: '1.25rem',
  fontWeight: 500,
}));

const StyledScrollContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  height: `calc(100vh - ${config.topBarHeight}px - ${config.bottomNavHeight}px)`,
  overflowY: 'auto',
}));

DrawerMenu.propTypes = {
  pageType: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggleDrawerMenu: PropTypes.func.isRequired,
  handleNavigation: PropTypes.func.isRequired,
};

export default DrawerMenu;
