import React from 'react';
import PropTypes from 'prop-types';

// TODO Remove this when redux selected event is used
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import {
  AccessTime, Phone, LocationOn, Event,
} from '@material-ui/icons';
import { changeSelectedEvent } from '../../redux/actions/event';
import DescriptionText from '../../components/DescriptionText';
import SearchBar from '../../components/SearchBar';
import TitleBar from '../../components/TitleBar/TitleBar';
import { DesktopComponent } from '../../layouts/WrapperComponents/WrapperComponents';
import SimpleListItem from '../../components/ListItems/SimpleListItem';
import ResultItem from '../../components/ListItems/ResultItem';
import TitledList from '../../components/Lists/TitledList';

class EventDetailView extends React.Component {
  componentDidMount() {
    const { event, changeSelectedEvent } = this.props;

    // TODO: move this first fetch to server side
    if (!event) {
      const { match } = this.props;
      if (match.params && match.params.event) {
        fetch(`https://api.hel.fi/linkedevents/v1/event/${match.params.event}/?include=location`)
          .then(response => response.json())
          .then(data => changeSelectedEvent(data));
      }
    }
  }

  // TODO: maybe combine this with the date fomratting used in events component
  formatDate = (event) => {
    const { intl } = this.props;
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
  }

  render() {
    const {
      event, intl, getLocaleText, navigator,
    } = this.props;
    if (event) {
      const description = event.description || event.short_description;
      const unit = event.location;
      const phoneNumber = unit.telephone ? getLocaleText(unit.telephone) : null;
      const time = this.formatDate(event);
      return (
        <>
          <DesktopComponent>
            <SearchBar placeholder={intl.formatMessage({ id: 'search' })} />
          </DesktopComponent>
          <TitleBar title={getLocaleText(event.name)} icon={<Event />} />

          {event.images && (
          <img
            style={{
              width: '100%', maxHeight: 300, objectFit: 'contain', backgroundColor: 'rgba(0,0,0,0.15)',
            }}
            alt={intl.formatMessage({ id: 'event.picture' })}
            src={event.images[0].url}
          />
          )}

          <TitledList titleComponent="h4" title={intl.formatMessage({ id: 'unit.contact.info' })}>
            <SimpleListItem
              key="eventHours"
              icon={<AccessTime />}
              text={time}
              srText={intl.formatMessage({ id: 'event.time' })}
              divider
            />
            <ResultItem
              key="unitInfo"
              icon={<LocationOn />}
              title={getLocaleText(unit.name)}
              subtitle={intl.formatMessage({ id: 'unit' })}
              onClick={(e) => {
                e.preventDefault();
                if (navigator) {
                  // Event database precedes unit id with tprek:
                  navigator.push('unit', unit.id.split(':').pop());
                }
              }}
            />
            <SimpleListItem
              key="contactNumber"
              icon={<Phone />}
              text={`${phoneNumber} ${intl.formatMessage({ id: 'unit.call.number' })}`}
              srText={intl.formatMessage({ id: 'unit.phone' })}
              link
              divider={false}
            />
          </TitledList>

          <DescriptionText
            description={getLocaleText(description)}
            title={intl.formatMessage({ id: 'event.description' })}
            html
          />
        </>
      );
    }
    return (null);
  }
}

EventDetailView.propTypes = {
  event: PropTypes.objectOf(PropTypes.any),
  changeSelectedEvent: PropTypes.func.isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: intlShape.isRequired,
  getLocaleText: PropTypes.func.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
};

EventDetailView.defaultProps = {
  event: null,
  navigator: null,
};

const mapStateToProps = (state) => {
  const event = state.event.selected;
  return {
    event,
  };
};

export default withRouter(injectIntl(connect(
  mapStateToProps,
  { changeSelectedEvent },
)(EventDetailView)));
