import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { fetchUnitEvents } from '../../redux/actions/event';
import { DesktopComponent } from '../../layouts/WrapperComponents/WrapperComponents';
import TitleBar from '../../components/TitleBar/TitleBar';
import SearchBar from '../../components/SearchBar';
import { getLocaleString } from '../../redux/selectors/locale';
import Events from './components/Events';

class UnitEventsView extends React.Component {
  componentDidMount() {
    const { unit, eventsData, fetchUnitEvents } = this.props;
    if (!eventsData.events) {
      if (unit) {
        fetchUnitEvents(unit.id);
      }
    }
  }

  render() {
    const {
      getLocaleText, unit, intl, eventsData,
    } = this.props;
    const topBar = (
      unit && (
        <>
          <DesktopComponent>
            <SearchBar placeholder={intl.formatMessage({ id: 'search' })} />
          </DesktopComponent>
          <TitleBar title={getLocaleText(unit.name)} />
        </>
      )
    );
    if (eventsData.events) {
      return (
        <>
          {topBar}
          <Events eventsData={eventsData} fullList />
        </>
      );
    }
    return (
      <>
        {topBar}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const eventsData = state.event.data;
  const unit = state.selectedUnit.data;
  return {
    getLocaleText,
    eventsData,
    unit,
  };
};

UnitEventsView.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any),
  eventsData: PropTypes.objectOf(PropTypes.any),
  intl: intlShape.isRequired,
  getLocaleText: PropTypes.func.isRequired,
  fetchUnitEvents: PropTypes.func.isRequired,
};

UnitEventsView.defaultProps = {
  unit: null,
  eventsData: { events: null, unit: null },
};

export default withRouter(injectIntl(connect(
  mapStateToProps,
  { fetchUnitEvents },
)(UnitEventsView)));
