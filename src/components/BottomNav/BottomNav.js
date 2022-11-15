import styled from '@emotion/styled';
import {
  ArrowBack, Map, Settings,
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

  const [settingsOpen, setSettingsOpen] = useState(false);

  const mapPage = location.search.indexOf('showMap=true') > -1;


  const handleNav = (value) => {
    switch (value) {
      // Back button
      case 0:
        if (navigator) {
          if (settingsOpen) {
            setSettingsOpen(false);
          } else {
            navigator.goBack();
          }
        }
        break;

      // Map button
      case 1:
        if (settingsOpen) {
          if (!mapPage) navigator.openMap();
          setSettingsOpen(false);
          break;
        }
        if (mapPage) {
          navigator.closeMap(breadcrumb.length ? 'replace' : null);
        } else {
          navigator.openMap();
          setSettingsOpen(false);
        }
        break;

      // Settings button
      case 2:
        setSettingsOpen(!settingsOpen);
        break;
      default:
        break;
    }
  };


  return (
    <>
      <StyledDrawer
        open={settingsOpen}
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
              label={!mapPage || settingsOpen
                ? intl.formatMessage({ id: 'map.open' })
                : intl.formatMessage({ id: 'map.close' })}
              icon={<Map />}
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
