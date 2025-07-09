import { Map, OpenInNew } from '@mui/icons-material';
import { ButtonBase, Tooltip as MUITooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';
import { visuallyHidden } from '@mui/utils';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Route, Switch, useLocation } from 'react-router-dom';

import { Dialog, HomeLogo, PaginatedList, SMButton } from '../components';
import { selectMapRef, selectNavigator } from '../redux/selectors/general';
import { parseSearchParams } from '../utils';
import { resolveCityAndOrganizationFilter } from '../utils/filters';
import useLocaleText from '../utils/useLocaleText';
import AddressView from '../views/AddressView';
import AreaView from '../views/AreaView';
import DivisionView from '../views/DivisionView';
import EventDetailView from '../views/EventDetailView';
import MapView from '../views/MapView';
import { focusToPosition } from '../views/MapView/utils/mapActions';
import useMapUnits from '../views/MapView/utils/useMapUnits';
import SearchView from '../views/SearchView';
import ServiceView from '../views/ServiceView';
import UnitView from '../views/UnitView';
import ContactInfo from '../views/UnitView/components/ContactInfo';
import PageHandler from './components/PageHandler';

const createContentStyles = (theme, unitListPosition) => {
  const bottomList = unitListPosition === 'bottom';
  const sideList = unitListPosition === 'side';
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
      top: sideList ? 0 : null,
      bottom: sideList ? null : 0,
      left: bottomList ? null : 0,
      right: bottomList ? 0 : null,
      height: 'auto',
      position: 'fixed',
      zIndex: 1000,
      margin: bottomList ? theme.spacing(2) : theme.spacing(1.5),
    },
    embedSidebarContainer: bottomList
      ? {
          height: 300,
          maxHeight: '40%',
          minHeight: '25%',
        }
      : {
          minWidth: 220,
          maxWidth: 'min(40%, 300px)',
          flexGrow: 1,
        },
    unitList: {
      paddingTop: bottomList ? 0 : 36,
      maxHeight: '100%',
      overflowY: 'auto',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
    },
  };
};

function EmbedLayout() {
  const intl = useIntl();
  const theme = useTheme();
  const location = useLocation();
  const navigator = useSelector(selectNavigator);
  const getLocaleText = useLocaleText();
  const mapUnits = useMapUnits();
  const cityAndOrgFilter = resolveCityAndOrganizationFilter(
    [],
    [],
    location,
    true
  );
  const units = mapUnits.filter(cityAndOrgFilter);
  const searchParams = parseSearchParams(location.search);
  const map = useSelector(selectMapRef);

  const showList = searchParams?.show_list;
  const selectedUnit = searchParams?.selectedUnit;

  const [selectedUnitData, setSelectedUnitData] = useState(null);

  const styles = createContentStyles(theme, showList);

  useEffect(() => {
    // Handle shown embedded unit data
    if (selectedUnit && units.length) {
      const unitData = units.find(
        (unit) => unit.id.toString() === selectedUnit
      );
      setSelectedUnitData(unitData);
    }
    if (!selectedUnit && selectedUnitData) {
      setSelectedUnitData(null);
    }
  }, [selectedUnit, units, selectedUnitData]);

  const closeDialog = () => {
    navigator.removeParameter('selectedUnit');
  };

  // Dialog to show selected unit basic information
  const renderEmbeddedUnitInfo = () => (
    <Dialog
      setOpen={setSelectedUnitData}
      onClose={closeDialog}
      open={!!selectedUnitData}
      title={getLocaleText(selectedUnitData.name)}
      content={<ContactInfo unit={selectedUnitData} headingLevel="h3" />}
      actions={
        <>
          <SMButton // Show on map button
            icon={<Map style={{ paddingRight: 8 }} />}
            style={{ marginRight: 'auto' }}
            aria-hidden
            messageID="general.showOnMap"
            onClick={() => {
              navigator.removeParameter('selectedUnit');
              focusToPosition(map, selectedUnitData.location.coordinates);
            }}
            margin
            role="link"
          />
          <SMButton // Open on servicemap button
            icon={<OpenInNew style={{ paddingRight: 8 }} />}
            color="primary"
            role="link"
            messageID="unit.showInformation"
            onClick={() => {
              const { origin } = window.location;
              const path = navigator.generatePath(
                'unit',
                { id: selectedUnitData.id },
                false
              );
              window.open(`${origin}${path}`);
            }}
          />
        </>
      }
    />
  );

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
        <MUITooltip
          title={intl.formatMessage({ id: 'embed.click_prompt_move' })}
        >
          <HomeLogo aria-hidden />
        </MUITooltip>
      </ButtonBase>
    );
  };

  return (
    <>
      {renderEmbedOverlay()}
      <div style={styles.activeRoot}>
        <div
          aria-hidden={!showList}
          style={styles.embedSidebarContainer}
          className={!showList ? 'sr-only' : ''}
          id="unitListContainer"
        >
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
              path="*/embed/address/:municipality/:street"
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
        <Typography style={visuallyHidden}>
          {intl.formatMessage({ id: 'map.ariaLabel' })}
        </Typography>

        {selectedUnitData ? renderEmbeddedUnitInfo() : null}

        <div aria-hidden tabIndex="-1" style={styles.map}>
          <MapView />
        </div>
      </div>
    </>
  );
}

export default EmbedLayout;
