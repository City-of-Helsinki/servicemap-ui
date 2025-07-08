import styled from '@emotion/styled';
import { AccountCircle, ArrowBack, Map, Settings } from '@mui/icons-material';
import {
  BottomNavigation,
  BottomNavigationAction,
  Drawer,
  Paper,
  useMediaQuery,
} from '@mui/material';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';

import config from '../../../config';
import {
  selectBreadcrumb,
  selectNavigator,
} from '../../redux/selectors/general';
import MapSettings from '../MapSettings/MapSettings';
import MobileSettingsHeader from '../MobileSettingsHeader/MobileSettingsHeader';
import SettingsDropdowns from '../SettingsDropdowns';

const { bottomNavHeight } = config;

function BottomNav() {
  const location = useLocation();
  const intl = useIntl();
  const small = useMediaQuery('(max-width:477px)');

  const navigator = useSelector(selectNavigator);
  const breadcrumb = useSelector(selectBreadcrumb);

  const [ownSettingsOpen, setOwnSettingsOpen] = useState(false);
  const [mapSettingsOpen, setMapSettingsOpen] = useState(false);

  const mapPage = location.search.indexOf('showMap=true') > -1;

  const handleBackButton = () => {
    if (navigator) {
      if (ownSettingsOpen || mapSettingsOpen) {
        setOwnSettingsOpen(false);
        setMapSettingsOpen(false);
      } else {
        navigator.goBack();
      }
    }
  };

  const handleMapButton = () => {
    if (ownSettingsOpen || mapSettingsOpen) {
      if (!mapPage) {
        navigator.openMap();
      }
      setOwnSettingsOpen(false);
      setMapSettingsOpen(false);
      return;
    }
    if (mapPage) {
      navigator.closeMap(breadcrumb.length ? 'replace' : null);
    } else {
      navigator.openMap();
      setOwnSettingsOpen(false);
      setMapSettingsOpen(false);
    }
  };

  const handleNav = (value) => {
    switch (value) {
      // Back button
      case 0:
        handleBackButton();
        break;

      // Map button
      case 1:
        handleMapButton();
        break;

      case 2:
        setOwnSettingsOpen(!ownSettingsOpen);
        setMapSettingsOpen(false);
        break;

      // Settings button
      case 3:
        setOwnSettingsOpen(false);
        setMapSettingsOpen(!mapSettingsOpen);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <StyledDrawer
        open={ownSettingsOpen}
        anchor="top"
        hideBackdrop
        transitionDuration={0}
        elevation={0}
        PaperProps={{
          sx: {
            height: `calc(100% - ${bottomNavHeight}px)`,
            p: 2,
            boxSizing: 'border-box',
          },
        }}
      >
        <StyledDiv>
          <MobileSettingsHeader
            textId="general.ownSettings"
            onClose={handleBackButton}
          />
          <SettingsDropdowns variant="ownSettings" />
        </StyledDiv>
      </StyledDrawer>
      <StyledDrawer
        open={mapSettingsOpen}
        anchor="top"
        hideBackdrop
        transitionDuration={0}
        elevation={0}
        PaperProps={{
          sx: {
            height: `calc(100% - ${bottomNavHeight}px)`,
            p: 2,
            boxSizing: 'border-box',
          },
        }}
      >
        <MapSettings onClose={handleBackButton} />
      </StyledDrawer>
      <nav>
        <StyledPaper elevation={10}>
          <StyledBottomNavigation
            showLabels
            onChange={(event, newValue) => handleNav(newValue)}
          >
            <StyledBottomNavigationAction
              small={+small}
              label={intl.formatMessage({ id: 'general.backTo' })}
              icon={<ArrowBack />}
            />
            <StyledBottomNavigationAction
              small={+small}
              label={
                !mapPage || mapSettingsOpen
                  ? intl.formatMessage({ id: 'map.open' })
                  : intl.formatMessage({ id: 'map.close' })
              }
              icon={<Map />}
            />
            <StyledBottomNavigationAction
              small={+small}
              label={intl.formatMessage({ id: 'general.ownSettings' })}
              icon={<AccountCircle />}
            />
            <StyledBottomNavigationAction
              small={+small}
              label={intl.formatMessage({ id: 'general.tools' })}
              icon={<Settings />}
            />
          </StyledBottomNavigation>
        </StyledPaper>
      </nav>
    </>
  );
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  zIndex: theme.zIndex.appBar,
  bottom: 0,
  left: 0,
  right: 0,
}));

const StyledDrawer = styled(Drawer)(() => ({
  width: '100%',
  height: `calc(100% - ${bottomNavHeight}px)`,
}));

const StyledBottomNavigation = styled(BottomNavigation)(() => ({
  backgroundColor: '#F4F4F4',
  height: 78,
}));

const StyledBottomNavigationAction = styled(BottomNavigationAction)(({
  small,
}) => {
  const styles = {
    color: '#000',
  };
  if (small) {
    Object.assign(styles, {
      '& span': { height: '34px' },
    });
  }
  return styles;
});

const StyledDiv = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(3),
}));

BottomNav.propTypes = {};

export default BottomNav;
