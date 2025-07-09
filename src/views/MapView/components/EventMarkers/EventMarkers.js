import styled from '@emotion/styled';
import { Close } from '@mui/icons-material';
import { ButtonBase, List, ListItem, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { changeSelectedEvent } from '../../../../redux/actions/event';
import { selectNavigator } from '../../../../redux/selectors/general';
import { selectThemeMode } from '../../../../redux/selectors/user';
import { parseSearchParams } from '../../../../utils';
import { getAddressFromUnit } from '../../../../utils/address';
import formatEventDate from '../../../../utils/events';
import { generatePath, isEmbed } from '../../../../utils/path';
import useLocaleText from '../../../../utils/useLocaleText';
import { drawMarkerIcon } from '../../utils/drawIcon';
import { StyledCloseText, StyledUnitTooltipTitle } from '../styled/styled';

const EventMarkers = ({ searchData }) => {
  const navigator = useSelector(selectNavigator);
  const getLocaleText = useLocaleText();
  const dispatch = useDispatch();
  const location = useLocation();
  const embeded = isEmbed();
  const useContrast = useSelector(selectThemeMode) === 'dark';
  const intl = useIntl();
  const map = useMap();
  const { Marker, Popup } = global.rL;
  const searchParams = parseSearchParams(location.search);

  const [unitData, setUnitData] = useState([]);

  const handleEventClick = (e, event) => {
    if (embeded) {
      if (searchParams.callback === 'true') {
        // TODO: create domain whitelist and add this url to it
        window.parent.postMessage(
          { eventId: event.id },
          'https://vapaaehtoistoiminta.hel.fi'
        );
      } else {
        const url = generatePath('event', null, event.id);
        window.open(url);
      }
    } else {
      e.preventDefault();
      if (navigator) {
        dispatch(changeSelectedEvent(event));
        navigator.push('event', event.id);
      }
    }
  };

  const closePopup = () => {
    if (map) {
      map.closePopup();
    }
  };

  const initializeEventData = () => {
    let events = searchData.filter(
      (item) => item.object_type === 'event' && item.location
    );
    if (searchParams.neighborhood) {
      // Filter with neighborhood
      events = events.filter((event) => {
        if (event.location?.divisions?.length) {
          const neighborhood = event.location.divisions.find(
            (obj) => obj.type === 'neighborhood'
          );
          if (
            neighborhood &&
            neighborhood.ocd_id === searchParams.neighborhood
          ) {
            return true;
          }
        }
        return false;
      });
    }
    // Create units from event locations
    const units = [];
    events.forEach((event) => {
      const { location } = event;
      if (!location) return;
      const duplicate = units.find((unit) => unit.id === location.id);
      if (!duplicate) {
        const newUnit = {
          id: location.id,
          name: location.name,
          object_type: 'unit',
          location: location.position,
          street_address: location.street_address,
          events: [event],
        };
        units.push(newUnit);
      } else {
        duplicate.events = [...duplicate.events, event];
      }
    });

    setUnitData(units.filter((unit) => unit.location));
  };

  useEffect(() => {
    initializeEventData();
  }, [searchData]);

  return unitData.map((unit) => {
    if (!unit.events?.length) return null;
    const streetAddress = getAddressFromUnit(unit, getLocaleText, intl);
    const eventList = unit.events;
    return (
      <Marker
        key={unit.id}
        icon={drawMarkerIcon(
          useContrast,
          `unit-marker-${unit.id}`,
          null,
          [0, -15]
        )}
        onMouseOver={(e) => {
          e.target.openPopup();
        }}
        position={[unit.location.coordinates[1], unit.location.coordinates[0]]}
      >
        <Popup autoPan closeButton={false}>
          <StyledPopupContainer>
            <StyledPopupTopArea>
              <StyledPopupTitleArea>
                <StyledUnitTooltipTitle>
                  {getLocaleText(unit.name)}
                </StyledUnitTooltipTitle>
                <StyledPopupCloseButton onClick={() => closePopup()}>
                  <StyledCloseText>
                    <FormattedMessage id="general.close" />
                  </StyledCloseText>
                  <StyledCloseIcon />
                </StyledPopupCloseButton>
              </StyledPopupTitleArea>
              <StyledAddressContainer>
                <StyledUnitTooltipSubtitle>
                  {streetAddress}
                </StyledUnitTooltipSubtitle>
              </StyledAddressContainer>
            </StyledPopupTopArea>
            <StyledPopupList disablePadding>
              {eventList.map((event) => (
                <StyledPopupListItem
                  key={event.id}
                  button
                  role="link"
                  disableGutters
                  onClick={(e) => {
                    handleEventClick(e, event);
                  }}
                >
                  <Typography>{getLocaleText(event.name)}</Typography>
                  <StyledEventDateText>
                    {formatEventDate(event, intl)}
                  </StyledEventDateText>
                </StyledPopupListItem>
              ))}
            </StyledPopupList>
          </StyledPopupContainer>
        </Popup>
      </Marker>
    );
  });
};

const StyledEventDateText = styled(Typography)(() => ({
  fontSize: '0.75rem',
}));

const StyledPopupListItem = styled(ListItem)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  paddingBottom: 0,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

const StyledPopupList = styled(List)(() => ({
  backgroundColor: '#fafafa',
  boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.06)',
  maxHeight: 175,
  overflow: 'scroll',
}));

const StyledUnitTooltipSubtitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
  margin: theme.spacing(0, 1),
}));

const StyledAddressContainer = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  paddingBottom: theme.spacing(1),
}));

const StyledCloseIcon = styled(Close)(() => ({
  fontSize: 18,
  width: 18,
  height: 18,
  lineHeight: '21px',
  marginLeft: 6,
  marginRight: 4,
}));

const StyledPopupCloseButton = styled(ButtonBase)(({ theme }) => ({
  marginLeft: 'auto',
  marginBottom: 'auto',
  marginRight: -theme.spacing(1),
  marginTop: 3,
  paddingLeft: theme.spacing(1),
}));

const StyledPopupTitleArea = styled.div(() => ({
  display: 'flex',
}));

const StyledPopupTopArea = styled.div(({ theme }) => ({
  paddingRight: theme.spacing(2),
  paddingLeft: theme.spacing(2),
}));

const StyledPopupContainer = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  paddingRight: 0,
  paddingLeft: 0,
}));

export default EventMarkers;
