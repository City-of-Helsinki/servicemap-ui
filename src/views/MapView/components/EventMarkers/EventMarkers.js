import React, { useEffect, useState } from 'react';
import {
  ButtonBase, List, ListItem, Typography,
} from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Close } from '@material-ui/icons';
import { useLocation } from 'react-router-dom';
import useLocaleText from '../../../../utils/useLocaleText';
import { getAddressFromUnit } from '../../../../utils/address';
import formatEventDate from '../../../../utils/events';
import { changeSelectedEvent } from '../../../../redux/actions/event';
import { drawMarkerIcon } from '../../utils/drawIcon';
import { generatePath, isEmbed } from '../../../../utils/path';
import { parseSearchParams } from '../../../../utils';


const EventMarkers = ({ searchData, classes, navigator }) => {
  const getLocaleText = useLocaleText();
  const dispatch = useDispatch();
  const location = useLocation();
  const embeded = isEmbed();
  const theme = useSelector(state => state.user.theme);
  const intl = useIntl();
  const mapRef = useSelector(state => state.mapRef);
  const { Marker, Popup } = global.rL;
  const searchParams = parseSearchParams(location.search);

  const [unitData, setUnitData] = useState([]);

  const handleEventClick = (e, event) => {
    if (embeded) {
      if (searchParams.callback === 'true') {
        // TODO: create domain whitelist and add this url to it
        window.parent.postMessage({ eventId: event.id }, 'https://vapaaehtoistoiminta.hel.fi');
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
    if (mapRef.leafletElement) {
      mapRef.leafletElement.closePopup();
    }
  };

  const initializeEventData = () => {
    let events = searchData.filter(item => item.object_type === 'event' && item.location);
    if (searchParams.neighborhood) { // Filter with neighborhood
      events = events.filter((event) => {
        if (event.location?.divisions?.length) {
          const neighborhood = event.location.divisions.find(obj => obj.type === 'neighborhood');
          if (neighborhood && neighborhood.ocd_id === searchParams.neighborhood) {
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
      const duplicate = units.find(unit => unit.id === location.id);
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

    setUnitData(units.filter(unit => unit.location));
  };


  useEffect(() => {
    initializeEventData();
  }, [searchData]);


  return (
    unitData.map((unit) => {
      if (!unit.events?.length) return null;
      const streetAddress = getAddressFromUnit(unit, getLocaleText, intl);
      const eventList = unit.events;
      return (
        <Marker
          key={unit.id}
          icon={drawMarkerIcon(theme === 'dark', `unit-marker-${unit.id}`, null, [0, -15])}
          onMouseOver={(e) => { e.target.openPopup(); }}
          position={[
            unit.location.coordinates[1],
            unit.location.coordinates[0],
          ]}
        >
          <Popup autoPan closeButton={false}>
            <div className={classes.popupContainer}>
              <div className={classes.popupTopArea}>
                <div className={classes.popoupTitleArea}>
                  <Typography className={classes.unitTooltipTitle}>
                    {getLocaleText(unit.name)}
                  </Typography>
                  <ButtonBase onClick={() => closePopup()} className={classes.popupCloseButton}>
                    <Typography className={classes.closeText}><FormattedMessage id="general.close" /></Typography>
                    <Close className={classes.infoIcon} />
                  </ButtonBase>
                </div>
                <div className={classes.addressContainer}>
                  <Typography className={classes.unitTooltipSubtitle}>
                    {streetAddress}
                  </Typography>
                </div>
              </div>
              <List className={classes.popupList} disablePadding>
                {eventList.map(event => (
                  <ListItem
                    key={event.id}
                    button
                    role="link"
                    disableGutters
                    className={classes.popupListItem}
                    onClick={(e) => { handleEventClick(e, event); }}
                  >
                    <Typography>{getLocaleText(event.name)}</Typography>
                    <Typography className={classes.eventDate}>
                      {formatEventDate(event, intl)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </div>
          </Popup>
        </Marker>
      );
    })
  );
};

export default EventMarkers;
