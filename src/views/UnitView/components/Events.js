import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getLocaleString } from '../../../redux/selectors/locale';
import TitledList from '../../../components/Lists/TitledList';
import { fetchUnitEvents } from '../../../redux/actions/selectedUnitEvents';
import EventItem from '../../../components/ListItems/EventItem';

const Events = ({
  unit,
  eventsData,
  listLength,
  navigator,
}) => {
  const {
    data, isFetching, max,
  } = eventsData;

  if (!data) {
    return null;
  }

  const location = useLocation();

  const endIndex = listLength > data.length ? data.length : listLength;
  const shownData = data && data.length ? data.slice(0, endIndex) : null;

  if (unit && shownData && shownData.length) {
    return (
      <div>
        <TitledList
          title={<FormattedMessage id="unit.events" />}
          subtitle={<FormattedMessage id="unit.events.count" values={{ count: max }} />}
          titleComponent="h4"
          shortened={max > listLength}
          buttonMessageID="unit.events.more"
          loading={isFetching}
          buttonID="UnitEventsButton"
          showMoreOnClick={listLength
            ? () => {
              if (navigator) {
                navigator.replace({
                  ...location,
                  hash: 'UnitEventsButton',
                });
                navigator.push('unit', { id: unit.id, type: 'events' });
              }
            } : null}
        >
          {shownData.map(event => (
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
  navigator: PropTypes.objectOf(PropTypes.any),
};

Events.defaultProps = {
  navigator: null,
  unit: null,
  listLength: 5,
};

export default connect(
  mapStateToProps,
  { fetchUnitEvents },
)(Events);
