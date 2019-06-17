import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { fetchUnitEvents } from '../../redux/actions/event';
import { DesktopComponent } from '../../layouts/WrapperComponents/WrapperComponents';
import { drawIcon } from '../Map/utils/drawIcon';
import fetchUnitReservations from './utils/fetchUnitReservations';
import TitleBar from '../../components/TitleBar/TitleBar';
import SearchBar from '../../components/SearchBar';
import { getLocaleString } from '../../redux/selectors/locale';
import Events from './components/Events';
import Services from './components/Services';
import Reservations from './components/Reservations';

class UnitFullListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      icon: null,
      content: null,
      reservations: null,
    };
  }

  componentDidMount() {
    const {
      unit, eventsData, fetchUnitEvents, location,
    } = this.props;

    if (unit) {
      const path = location.pathname;
      if (path.indexOf('/services') > -1) {
        this.setState({ content: 'services' });
      }
      if (path.indexOf('/events') > -1) {
        this.setState({ content: 'events' });
        if (!eventsData.events) {
          fetchUnitEvents(unit.id);
        }
      }
      if (path.indexOf('/reservations') > -1) {
        this.setState({ content: 'reservations' });
        fetchUnitReservations(unit.id)
          .then(data => this.setState({ reservations: data.results }));
      }

      this.setState({
        icon: <img alt="" src={drawIcon({ id: unit.id }, null, true)} style={{ height: 24 }} />,
      });
    }
  }

  getContent = () => {
    const { getLocaleText, unit, eventsData } = this.props;
    const { content, reservations } = this.state;
    switch (content) {
      case 'services':
        return <Services unit={unit} />;
      case 'events':
        return <Events eventsData={eventsData} />;
      case 'reservations':
        return <Reservations reservations={reservations} getLocaleText={getLocaleText} />;
      default:
        return null;
    }
  }

  render() {
    const { getLocaleText, unit, intl } = this.props;
    const { icon } = this.state;
    const topBar = (
      unit && (
        <>
          <DesktopComponent>
            <SearchBar placeholder={intl.formatMessage({ id: 'search' })} />
          </DesktopComponent>
          <TitleBar icon={icon} title={getLocaleText(unit.name)} />
        </>
      )
    );

    return (
      <div style={{ height: '100%', overflow: 'auto' }}>
        {topBar}
        {this.getContent()}
      </div>
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

UnitFullListView.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any),
  eventsData: PropTypes.objectOf(PropTypes.any),
  intl: intlShape.isRequired,
  getLocaleText: PropTypes.func.isRequired,
  fetchUnitEvents: PropTypes.func.isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
};

UnitFullListView.defaultProps = {
  unit: null,
  eventsData: { events: null, unit: null },
};

export default withRouter(injectIntl(connect(
  mapStateToProps,
  { fetchUnitEvents },
)(UnitFullListView)));
