/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// TODO Remove this when redux selected event is used
import { AccessTime, Phone, Event } from '@material-ui/icons';
import {
  DescriptionText,
  SearchBar,
  SimpleListItem,
  TitleBar,
  TitledList,
  UnitItem,
} from '../../components';
import UnitHelper from '../../utils/unitHelper';
import { eventFetch } from '../../utils/fetch';
import { focusToPosition } from '../MapView/utils/mapActions';
import useLocaleText from '../../utils/useLocaleText';
import useMobileStatus from '../../utils/isMobile';

const EventDetailView = (props) => {
  const {
    event,
    changeSelectedEvent,
    fetchSelectedUnit,
    match,
    selectedUnit,
    map,
    intl,
    classes,
    embed,
  } = props;

  const isMobile = useMobileStatus();
  const getLocaleText = useLocaleText();
  const [centered, setCentered] = useState(false);
  const [fetchingEvent, setFetchingEvent] = useState(false);


  const centerMap = (unit) => {
    if (unit && (unit.location || unit.position) && map && map.options.maxZoom && !centered) {
      const location = unit.location || unit.position;
      setCentered(true);
      focusToPosition(map, location.coordinates);
    }
  };

  // TODO: maybe combine this with the date fomratting used in events component
  const formatDate = (event) => {
    const startDate = intl.formatDate(event.start_time, {
      year: 'numeric', month: 'numeric', day: 'numeric',
    });
    const endDate = intl.formatDate(event.end_time, {
      year: 'numeric', month: 'numeric', day: 'numeric',
    });
    const startDateFull = intl.formatDate(event.start_time, {
      weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric',
    });
    const endDateFull = intl.formatDate(event.end_time, {
      weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric',
    });

    let time = `${startDateFull} —\n${endDateFull}`;
    if (startDate === endDate) {
      if (startDateFull !== endDateFull) {
        time = `${startDateFull} — ${intl.formatDate(event.end_time, { hour: 'numeric', minute: 'numeric' })}`;
      } else {
        time = startDateFull;
      }
    }
    return time;
  };

  useEffect(() => {
    // TODO: move this first fetch to server side
    if (!event) {
      if (match.params && match.params.event) {
        const options = {
          include: 'location,location.accessibility_shortcoming_count',
        };
        const onStart = () => {
          setFetchingEvent(true);
        };
        const onError = () => {
          setFetchingEvent(false);
        };
        const onSuccess = (data) => {
          setFetchingEvent(false);
          changeSelectedEvent(data);

          // Attempt fetching selected unit if it doesn't exist or isn't correct one
          const unit = data.location;
          if (typeof unit === 'object' && unit.id) {
            const unitId = typeof unit.id === 'string' ? unit.id.split(':').pop() : unit.id;
            if (
              !UnitHelper.isValidUnit(selectedUnit)
                  || parseInt(unitId, 10) !== selectedUnit.id
            ) {
              fetchSelectedUnit(unitId, (data) => {
                centerMap(data);
              });
            }
          }
        };
        eventFetch(options, onStart, onSuccess, onError, null, match.params.event);
      }
    } else if (!selectedUnit || event.location.id !== selectedUnit.id) {
      // Attempt fetching selected unit if it doesn't exist or isn't correct one
      const unit = event.location;
      centerMap(event.location);
      if (typeof unit === 'object' && unit.id) {
        const unitId = typeof unit.id === 'string' ? unit.id.split(':').pop() : unit.id;
        if (
          !UnitHelper.isValidUnit(selectedUnit)
              || parseInt(unitId, 10) !== selectedUnit.id
        ) {
          fetchSelectedUnit(unitId);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (map && !centered) {
      centerMap(event.location);
    }
  }, [map]);


  const renderEventDetails = () => {
    if (!event) return null;
    const unit = selectedUnit;
    const description = event.description || event.short_description;
    const phoneText = unit && unit.phone ? `${unit.phone} ${intl.formatMessage({ id: 'unit.call.number' })}` : null;
    const time = formatDate(event);

    return (
      <>
        {event.images && event.images.length ? (
          <img
            className={classes.eventImage}
            alt={intl.formatMessage({ id: 'event.picture' })}
            src={event.images[0].url}
          />
        ) : null}
        <div className={classes.content}>
          <TitledList titleComponent="h4" title={intl.formatMessage({ id: 'unit.contact.info' })}>
            <SimpleListItem
              key="eventHours"
              icon={<AccessTime />}
              text={time}
              srText={intl.formatMessage({ id: 'event.time' })}
              divider
            />
            {
            unit
            && (
              <UnitItem
                key="unitInfo"
                unit={unit}
              />
            )
          }
            {
             phoneText
             && (
             <SimpleListItem
               key="contactNumber"
               icon={<Phone />}
               text={phoneText}
               srText={intl.formatMessage({ id: 'unit.phone' })}
               link
               divider
               handleItemClick={() => {
                 window.location.href = `tel:${unit.phone}`;
               }}
             />
             )
           }
          </TitledList>

          <DescriptionText
            description={getLocaleText(description)}
            html
            title={intl.formatMessage({ id: 'event.description' })}
            titleComponent="h4"
          />
        </div>
      </>
    );
  };


  if (embed) {
    return null;
  }

  let title;

  if (event) {
    title = getLocaleText(event.name);
  } else if (fetchingEvent) {
    title = intl.formatMessage({ id: 'general.loading' });
  } else {
    title = intl.formatMessage({ id: 'general.noData' });
  }

  return (
    <div>
      {!isMobile ? (
        <SearchBar margin />
      ) : null}

      <TitleBar
        sticky
        title={title}
        titleComponent="h3"
        icon={event ? <Event /> : null}
        primary={isMobile}
        backButton={isMobile}
      />
      {renderEventDetails()}
    </div>
  );
};

EventDetailView.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  changeSelectedEvent: PropTypes.func.isRequired,
  embed: PropTypes.bool,
  event: PropTypes.objectOf(PropTypes.any),
  fetchSelectedUnit: PropTypes.func.isRequired,
  map: PropTypes.objectOf(PropTypes.any),
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  selectedUnit: PropTypes.objectOf(PropTypes.any),
};

EventDetailView.defaultProps = {
  embed: false,
  event: null,
  map: null,
  selectedUnit: null,
};

export default EventDetailView;
