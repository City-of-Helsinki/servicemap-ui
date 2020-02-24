import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getLocaleString } from '../../../redux/selectors/locale';
import TitledList from '../../../components/Lists/TitledList';
import { fetchUnitEvents, fetchAdditionalEvents } from '../../../redux/actions/selectedUnitEvents';
import EventItem from '../../../components/ListItems/EventItem';

const Events = ({
  unit,
  eventsData,
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
          {events.map(event => (
            <EventItem key={event.id} event={event} />
          ))}
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
  showMoreCount: PropTypes.number,
  fetchUnitEvents: PropTypes.func.isRequired,
  fetchAdditionalEvents: PropTypes.func.isRequired,
};

Events.defaultProps = {
  unit: null,
  listLength: null,
  showMoreCount: 15,
};

export default connect(
  mapStateToProps,
  { fetchUnitEvents, fetchAdditionalEvents },
)(Events);
