/* eslint-disable no-underscore-dangle */
import { css } from '@emotion/css';
import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

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
import { selectMapRef } from '../../redux/selectors/general';
import {
  getServiceUnits,
  selectServiceDataSet,
} from '../../redux/selectors/service';
import { selectCustomPositionCoordinates } from '../../redux/selectors/user';
import { applyCityAndOrganizationFilter } from '../../utils/filters';
import { coordinateIsActive } from '../../utils/mapUtility';
import { applySortingParams } from '../../utils/orderUnits';
import useLocaleText from '../../utils/useLocaleText';
import { fitUnitsToMap, focusToPosition } from '../MapView/utils/mapActions';

const StyledTitleBar = styled(TitleBar)(({ theme }) => ({
  background: theme.palette.primary.main,
}));

function ServiceView(props) {
  const { fetchService, embed = false } = props;
  const params = useParams();
  const location = useLocation();
  const getLocaleText = useLocaleText();
  const map = useSelector(selectMapRef);
  const serviceReducer = useSelector(selectServiceDataSet);
  const unitData = applySortingParams(
    applyCityAndOrganizationFilter(
      useSelector(getServiceUnits),
      location,
      embed
    )
  );
  const customPositionCoordinates = useSelector(
    selectCustomPositionCoordinates
  );
  const intl = useIntl();
  const [mapMoved, setMapMoved] = useState(false);
  const [icon, setIcon] = useState(null);

  // Check if view will fetch data because search params has changed
  const shouldFetch = () => {
    const { current, isFetching } = serviceReducer;
    return !isFetching && (!current || `${current.id}` !== params?.service);
  };

  const focusMap = (unit) => {
    if (!map || !map.options.maxZoom || mapMoved) {
      return;
    }

    if (customPositionCoordinates) {
      setMapMoved(true);
      focusToPosition(map, [
        customPositionCoordinates.longitude,
        customPositionCoordinates.latitude,
      ]);
      return;
    }
    if (unit?.length) {
      setMapMoved(true);
      fitUnitsToMap(unit, map);
    }
  };
  const iconClass = css({ height: 24 });

  useEffect(() => {
    setIcon(getIcon('service', { className: iconClass }));
    if (shouldFetch()) {
      fetchService(params?.service);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.service]);

  useEffect(() => {
    if (coordinateIsActive(location)) {
      return;
    }
    if (unitData.length) {
      focusMap(unitData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const initialOrder = customPositionCoordinates ? 'distance-asc' : null;
  const paginatedListTitle = intl.formatMessage({ id: 'unit.plural' });

  return (
    <div>
      <DesktopComponent>
        <SearchBar margin />
        {showTitle && (
          <StyledTitleBar
            icon={icon}
            title={getLocaleText(current.name)}
            titleComponent="h3"
          />
        )}
      </DesktopComponent>
      {showTitle && (
        <MobileComponent>
          <StyledTitleBar
            icon={icon}
            title={getLocaleText(current.name)}
            titleComponent="h3"
            primary
          />
        </MobileComponent>
      )}
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
      {showServiceWithoutUnits && (
        <Container margin>
          <Typography variant="body1" align="left">
            <FormattedMessage id="service.units.empty" />
          </Typography>
        </Container>
      )}
    </div>
  );
}

ServiceView.propTypes = {
  embed: PropTypes.bool,
  fetchService: PropTypes.func.isRequired,
};

export default ServiceView;
