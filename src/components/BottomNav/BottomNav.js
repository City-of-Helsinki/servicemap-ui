import styled from '@emotion/styled';
import {
  AccountCircle,
  ArrowBack,
  Map,
  Settings,
} from '@mui/icons-material';
import {
  BottomNavigation,
  BottomNavigationAction,
  Drawer,
  Paper,
} from '@mui/material';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import config from '../../../config';
import MapSettings from '../MapSettings/MapSettings';

const { bottomNavHeight } = config;


const BottomNav = () => {
  const location = useLocation();
  const intl = useIntl();

  const navigator = useSelector(state => state.navigator);
  const breadcrumb = useSelector(state => state.breadcrumb);

  const [mapSettingsOpen, setMapSettingsOpen] = useState(false);

  const mapPage = location.search.indexOf('showMap=true') > -1;


  const handleNav = (value) => {
    switch (value) {
      // Back button
      case 0:
        if (navigator) {
          if (mapSettingsOpen) {
            setMapSettingsOpen(false);
          } else {
            navigator.goBack();
          }
        }
        break;

      // Map button
      case 1:
        if (mapSettingsOpen) {
          if (!mapPage) navigator.openMap();
          setMapSettingsOpen(false);
          break;
        }
        if (mapPage) {
          navigator.closeMap(breadcrumb.length ? 'replace' : null);
        } else {
          navigator.openMap();
          setMapSettingsOpen(false);
        }
        break;

      case 2:
        break;

      // Settings button
      case 3:
        setMapSettingsOpen(!mapSettingsOpen);
        break;
      default:
        break;
    }
  };


  return (
    <>
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
        <MapSettings />
      </StyledDrawer>
      <nav>
        <StyledPaper elevation={10}>
          <StyledBottomNavigation showLabels onChange={(event, newValue) => handleNav(newValue)}>
            <StyledBottomNavigationAction
              label={intl.formatMessage({ id: 'general.backTo' })}
              icon={<ArrowBack />}
            />
            <StyledBottomNavigationAction
              label={!mapPage || mapSettingsOpen
                ? intl.formatMessage({ id: 'map.open' })
                : intl.formatMessage({ id: 'map.close' })}
              icon={<Map />}
            />
            <StyledBottomNavigationAction
              label={intl.formatMessage({ id: 'general.settings' })}
              icon={<AccountCircle />}
            />
            <StyledBottomNavigationAction
              label={intl.formatMessage({ id: 'general.tools' })}
              icon={<Settings />}
            />
          </StyledBottomNavigation>
        </StyledPaper>
      </nav>
    </>
  );
};

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


const StyledBottomNavigationAction = styled(BottomNavigationAction)(() => ({
  color: '#000',
}));


export default BottomNav;
