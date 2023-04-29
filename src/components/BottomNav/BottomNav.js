import styled from '@emotion/styled';
import {
  AccountCircle, ArrowBack, Map, Settings,
} from '@mui/icons-material';
import {
  BottomNavigation, BottomNavigationAction, Drawer, Paper,
} from '@mui/material';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import PropTypes from 'prop-types';
import config from '../../../config';
import MapSettings from '../MapSettings/MapSettings';
import SettingsDropdowns from '../SettingsDropdowns';
import MobileSettingsHeader from '../MobileSettingsHeader/MobileSettingsHeader';

const { bottomNavHeight } = config;


const BottomNav = ({ classes }) => {
  const location = useLocation();
  const intl = useIntl();

  const navigator = useSelector(state => state.navigator);
  const breadcrumb = useSelector(state => state.breadcrumb);

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
        <div className={classes.container}>
          <MobileSettingsHeader textId="general.ownSettings" />
          <SettingsDropdowns variant="ownSettings" />
        </div>
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
              label={intl.formatMessage({ id: 'general.ownSettings' })}
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

BottomNav.propTypes = {
  classes: PropTypes.shape({
    container: PropTypes.string,
  }).isRequired,
};

export default BottomNav;
