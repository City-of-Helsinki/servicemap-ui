import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Event } from '@material-ui/icons';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { getLocaleString } from '../../../redux/selectors/locale';
import { changeSelectedEvent } from '../../../redux/actions/event';
import TitledList from '../../../components/Lists/TitledList';
import ResultItem from '../../../components/ListItems/ResultItem';
import { fetchUnitEvents, fetchAdditionalEvents } from '../../../redux/actions/selectedUnitEvents';

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
  unit,
  eventsData,
  navigator,
  classes,
  getLocaleText,
  intl,
  changeSelectedEvent,
  listLength,
  showMoreCount,
  fetchUnitEvents,
  fetchAdditionalEvents,
}) => {
  const [ref, setRef] = useState(listLength);
  const events = eventsData.data;
  const { isFetching, count, next } = eventsData;

  if (unit && events && events.length) {
    return (
      <div ref={ref => setRef(ref)}>
        <TitledList
          title={<FormattedMessage id="unit.events" />}
          subtitle={<FormattedMessage id="unit.events.count" values={{ count }} />}
          titleComponent="h4"
          shortened={events.length < count}
          buttonMessageID="unit.events.more"
          loading={isFetching}
          showMoreOnClick={listLength
            ? () => {
              if (!isFetching) {
                const lastListItem = ref.querySelector('li:nth-last-of-type(2)');
                lastListItem.focus();
                if (events.length < showMoreCount) {
                  fetchUnitEvents(unit.id, showMoreCount, true);
                } else {
                  fetchAdditionalEvents(next);
                }
              }
            } : null}
        >
          {events.map((event) => {
            const dateString = formatEventDate(event, intl);
            return (
              <ResultItem
                key={event.id}
                icon={<Event className={classes.eventIcon} />}
                title={getLocaleText(event.name)}
                subtitle={dateString}
                divider
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
      </div>
    );
  } return (
    null
  );
};

const mapStateToProps = (state) => {
  const unit = state.selectedUnit.unit.data;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const { navigator } = state;
  return {
    unit,
    getLocaleText,
    navigator,
  };
};

Events.propTypes = {
  eventsData: PropTypes.objectOf(PropTypes.any).isRequired,
  unit: PropTypes.objectOf(PropTypes.any),
  listLength: PropTypes.number,
  getLocaleText: PropTypes.func.isRequired,
  changeSelectedEvent: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  intl: intlShape.isRequired,
  showMoreCount: PropTypes.number,
  fetchUnitEvents: PropTypes.func.isRequired,
  fetchAdditionalEvents: PropTypes.func.isRequired,
};

Events.defaultProps = {
  unit: null,
  navigator: null,
  listLength: null,
  showMoreCount: 15,
};

export default injectIntl(connect(
  mapStateToProps,
  { changeSelectedEvent, fetchUnitEvents, fetchAdditionalEvents },
)(Events));
