/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@mui/material';
import {
  Container,
  DesktopComponent,
  getIcon,
  Loading,
  MobileComponent,
  PaginatedList,
  ResultOrderer,
  SearchBar,
  TitleBar,
} from '../../components';
import { fitUnitsToMap, focusToPosition } from '../MapView/utils/mapActions';
import coordinateIsActive from '../../utils/coordinate';
import useLocaleText from '../../utils/useLocaleText';

const ServiceView = (props) => {
  const {
    classes,
    match,
    fetchService,
    customPosition,
    embed,
    intl,
    serviceReducer,
    unitData,
    map,
    location,
  } = props;
  const getLocaleText = useLocaleText();
  const [mapMoved, setMapMoved] = useState(false);
  const [icon, setIcon] = useState(null);

  // Check if view will fetch data because search params has changed
  const shouldFetch = () => {
    const { current, isFetching } = serviceReducer;
    return !isFetching && (!current || `${current.id}` !== match.params?.service);
  };

  const focusMap = (unit) => {
    if (!map || !map.options.maxZoom || mapMoved) {
      return;
    }

    if (customPosition) {
      setMapMoved(true);
      focusToPosition(
        map,
        [customPosition.longitude, customPosition.latitude],
      );
      return;
    }
    if (unit?.length) {
      setMapMoved(true);
      fitUnitsToMap(unit, map);
    }
  };


  useEffect(() => {
    setIcon(getIcon('service', { className: classes.icon }));
    if (shouldFetch()) {
      fetchService(match.params?.service);
    }
  }, [match.params.service]);

  useEffect(() => {
    if (coordinateIsActive(location)) {
      return;
    }
    if (unitData.length) {
      focusMap(unitData);
    }
  }, [unitData]);


  if (embed) {
    return null;
  }
  const { current, isFetching } = serviceReducer;

  let serviceUnits = null;
  if (unitData && unitData.length > 0) {
    serviceUnits = unitData;
  }

  // Calculate visible components
  const showTitle = current && current.name;
  const showServiceWithoutUnits = current && !isFetching && !serviceUnits;

  const initialOrder = customPosition ? 'distance-asc' : null;
  const paginatedListTitle = intl.formatMessage({ id: 'unit.plural' });

  return (
    <div>
      <DesktopComponent>
        <SearchBar margin />
        {
          showTitle
          && (
            <TitleBar
              className={classes.titlebar}
              icon={icon}
              title={getLocaleText(current.name)}
              titleComponent="h3"
            />
          )
        }
      </DesktopComponent>
      {
        showTitle
        && (
          <MobileComponent>
            <TitleBar
              className={classes.titlebar}
              icon={icon}
              title={getLocaleText(current.name)}
              titleComponent="h3"
              primary
            />
          </MobileComponent>
        )
      }
      <Loading reducer={serviceReducer}>
        <ResultOrderer initialOrder={initialOrder} />
        <PaginatedList
          id="events"
          data={serviceUnits || []}
          srTitle={paginatedListTitle}
          title={paginatedListTitle}
          titleComponent="h4"
        />
      </Loading>
      {
          showServiceWithoutUnits
          && (
            <Container margin>
              <Typography variant="body1" align="left"><FormattedMessage id="service.units.empty" /></Typography>
            </Container>
          )
        }
    </div>
  );
};

ServiceView.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  customPosition: PropTypes.shape({
    latitude: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    longitude: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  embed: PropTypes.bool,
  match: PropTypes.objectOf(PropTypes.any),
  unitData: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.any),
    PropTypes.arrayOf(PropTypes.any),
  ]),
  fetchService: PropTypes.func.isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  map: PropTypes.objectOf(PropTypes.any),
  serviceReducer: PropTypes.shape({
    count: PropTypes.number,
    data: PropTypes.arrayOf(PropTypes.any),
    isFetching: PropTypes.bool,
    current: PropTypes.objectOf(PropTypes.any),
  }),
};

ServiceView.defaultProps = {
  customPosition: null,
  embed: false,
  match: {},
  unitData: [],
  map: null,
  serviceReducer: {},
};

export default ServiceView;
