
import React from 'react';
import PropTypes from 'prop-types';
import {
  Switch, Route, useLocation,
} from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { Tooltip as MUITooltip, ButtonBase, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import MapView from '../views/MapView';
import PageHandler from './components/PageHandler';
import AddressView from '../views/AddressView';
import EventDetailView from '../views/EventDetailView';
import SearchView from '../views/SearchView';
import UnitView from '../views/UnitView';
import ServiceView from '../views/ServiceView';
import DivisionView from '../views/DivisionView';
import AreaView from '../views/AreaView';
import { parseSearchParams } from '../utils';
import HomeLogo from '../components/Logos/HomeLogo';
import PaginatedList from '../components/Lists/PaginatedList';
import useMapUnits from '../views/MapView/utils/useMapUnits';

const createContentStyles = (theme, bottomList) => {
  const width = 450;
  return {
    activeRoot: {
      margin: 0,
      width: '100%',
      display: 'flex',
      flexWrap: 'nowrap',
      height: '100vh',
      flexDirection: bottomList ? 'column-reverse' : 'row',
    },
    map: {
      bottom: 0,
      margin: 0,
      flex: 1,
      display: 'flex',
      width: '100%',
    },
    sidebar: {
      height: '100%',
      position: 'relative',
      top: 0,
      bottom: 0,
      width,
      margin: 0,
      overflow: 'auto',
      visibility: null,
    },
    topNav: {
      minWidth: width,
    },
    embedLogo: {
      top: 0,
      left: 0,
      height: 'auto',
      position: 'fixed',
      zIndex: 1000,
      margin: theme.spacing(1.5),
    },
    embedSidebarContainer: bottomList
      ? {
        height: 300,
        maxHeight: '35%',
        minHeight: '25%',
      } : {
        minWidth: 220,
        maxWidth: 'min(40%, 300px)',
        flexGrow: 1,
      },
    unitList: {
      paddingTop: bottomList ? 0 : 36,
      maxHeight: '100%',
      overflowY: 'scroll',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
    },
  };
};

const EmbedLayout = ({ intl }) => {
  const theme = useTheme();
  const location = useLocation();
  const units = useMapUnits();
  const searchParams = parseSearchParams(location.search);

  const showList = searchParams?.show_list;
  const bottomUnitList = showList && showList === 'bottom';

  const styles = createContentStyles(theme, bottomUnitList);

  const renderEmbedOverlay = () => {
    const openApp = () => {
      const url = window.location.href;
      window.open(url.replace('/embed', ''));
    };
    return (
      <ButtonBase
        style={styles.embedLogo}
        onClick={openApp}
        aria-label={intl.formatMessage({ id: 'embed.click_prompt_move' })}
        role="link"
      >
        <MUITooltip title={intl.formatMessage({ id: 'embed.click_prompt_move' })}>
          <HomeLogo aria-hidden />
        </MUITooltip>
      </ButtonBase>
    );
  };

  return (
    <>
      {renderEmbedOverlay()}
      <div style={styles.activeRoot}>
        <div aria-hidden={!showList} style={styles.embedSidebarContainer} className={!showList ? 'sr-only' : ''} id="unitListContainer">
          <div style={styles.unitList}>
            <PaginatedList
              id="embeddedResults"
              data={units}
              titleComponent="h3"
              embeddedList={showList}
            />
          </div>
          <Switch>
            <Route
              path="*/embed/unit/:unit"
              render={() => (
                <>
                  <PageHandler embed page="unit" />
                  <UnitView embed />
                </>
              )}
            />
            <Route
              path="*/embed/event/:event"
              render={() => (
                <>
                  <PageHandler embed page="event" />
                  <EventDetailView embed />
                </>
              )}
            />
            <Route
              path="*/embed/search"
              render={() => (
                <>
                  <PageHandler embed page="search" />
                  <SearchView embed />
                </>
              )}
            />
            <Route
              path="*/embed/service/:service"
              render={() => (
                <>
                  <PageHandler embed page="service" />
                  <ServiceView embed />
                </>
              )}
            />
            <Route
              path="*/embed/address/:municipality/:street/:number/"
              render={() => (
                <>
                  <PageHandler embed page="address" />
                  <AddressView embed />
                </>
              )}
            />
            <Route
              path="*/embed/division/:city?/:area?"
              render={() => (
                <>
                  <PageHandler embed page="division" />
                  <DivisionView />
                </>
              )}
            />
            <Route
              path="*/embed/area/"
              render={() => (
                <>
                  <PageHandler embed page="area" />
                  <AreaView embed />
                </>
              )}
            />
          </Switch>
        </div>
        <Typography variant="srOnly">{intl.formatMessage({ id: 'map.ariaLabel' })}</Typography>
        <div aria-hidden tabIndex="-1" style={styles.map}>
          <MapView />
        </div>
      </div>
    </>
  );
};

EmbedLayout.propTypes = {
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default injectIntl(EmbedLayout);
