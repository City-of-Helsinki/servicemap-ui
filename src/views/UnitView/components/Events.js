import React from 'react';
import PropTypes from 'prop-types';
import { Event } from '@material-ui/icons';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { getLocaleString } from '../../../redux/selectors/locale';
import { changeSelectedEvent } from '../../../redux/actions/event';
import TitledList from '../../../components/Lists/TitledList';
import ResultItem from '../../../components/ListItems/ResultItem';
import ServiceMapButton from '../../../components/ServiceMapButton/ServiceMapButton';

const formatEventDate = (event, intl) => {
  const timeString = intl.formatMessage({ id: 'general.time.short' });
  const start = new Date(event.start_time);
  const end = new Date(event.end_time);
  const startDate = intl.formatDate(start, { month: 'numeric', day: 'numeric' });
  const endDate = intl.formatDate(end, { month: 'numeric', day: 'numeric' });
  const startTime = `${timeString} ${intl.formatTime(start)}`;
  const startWeekDay = intl.formatDate(start, { weekday: 'short' });

  if (startDate !== endDate) {
    return `${startDate}–${endDate}`;
  }
  let dateString = `${startWeekDay} ${startDate} ${startTime}`;
  // Check how many days to start of event. Returns number of days or "today"/"tomorrow"
  const daysTo = intl.formatRelative(start, { units: 'day' });
  // Check if string has numbers. If false, means that value is either "today" or "tomorrow"
  if (!/\d/.test(daysTo)) {
    // Instead of date, display "today" or "tomorrow"
    dateString = `${daysTo} ${startTime}`;
  }
  return dateString;
};

const Events = ({
  unit, eventsData, fullList, navigator, getLocaleText, intl, changeSelectedEvent,
}) => {
  const { events } = eventsData;
  if (events && events.length > 0) {
    let eventList = events;
    if (!fullList && events.length > 5) {
      eventList = events.slice(0, 5);
    }
    if (unit && eventsData.unit === unit.id) {
      return (
        <>
          <TitledList
            title={<FormattedMessage id="unit.events" />}
            titleComponent="h4"
          >
            {eventList.map((event) => {
              const dateString = formatEventDate(event, intl);
              return (
                <ResultItem
                  key={event.id}
                  icon={<Event />}
                  title={getLocaleText(event.name)}
                  subtitle={dateString}
                  onClick={(e) => {
                    e.preventDefault();
                    if (navigator) {
                      changeSelectedEvent(event);
                      navigator.push('event', event.id);
                    }
                  }}
                />
              );
            })}
          </TitledList>
          { !fullList && (
          <ServiceMapButton
            onClick={(e) => {
              e.preventDefault();
              if (navigator) {
                navigator.push('unitEvents', unit.id);
              }
            }}
          >
            <FormattedMessage id="event.more" values={{ count: events.length }} />
          </ServiceMapButton>
          )}
        </>
      );
    }
  } return (
    null
  );
};

const mapStateToProps = (state) => {
  const unit = state.selectedUnit.data;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const { navigator } = state;
  return {
    unit,
    getLocaleText,
    navigator,
  };
};

Events.propTypes = {
  eventsData: PropTypes.objectOf(PropTypes.any),
  unit: PropTypes.objectOf(PropTypes.any),
  fullList: PropTypes.bool,
  getLocaleText: PropTypes.func.isRequired,
  changeSelectedEvent: PropTypes.func.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  intl: intlShape.isRequired,
};

Events.defaultProps = {
  eventsData: { events: null, unit: null },
  unit: null,
  fullList: false,
  navigator: null,
};

export default injectIntl(connect(
  mapStateToProps,
  { changeSelectedEvent },
)(Events));
