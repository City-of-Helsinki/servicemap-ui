import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { fetchUnitEvents } from '../../redux/actions/event';
import { DesktopComponent, MobileComponent } from '../../layouts/WrapperComponents/WrapperComponents';
import fetchUnitReservations from './utils/fetchUnitReservations';
import TitleBar from '../../components/TitleBar';
import SearchBar from '../../components/SearchBar';
import { getLocaleString } from '../../redux/selectors/locale';
import Events from './components/Events';
import Services from './components/Services';
import Reservations from './components/Reservations';
import styles from './styles/styles';
import HeadModifier from '../../utils/headModifier';
import UnitIcon from '../../components/SMIcon/UnitIcon';

class UnitFullListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      icon: null,
      content: null,
      titleId: null,
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
        this.setState({
          content: 'services',
          titleId: 'unit.list.services',
        });
      }
      if (path.indexOf('/events') > -1) {
        this.setState({
          content: 'events',
          titleId: 'unit.list.events',
        });
        if (!eventsData.events) {
          fetchUnitEvents(unit.id);
        }
      }
      if (path.indexOf('/reservations') > -1) {
        this.setState({
          content: 'reservations',
          titleId: 'unit.list.reservations',
        });
        fetchUnitReservations(unit.id)
          .then(data => this.setState({ reservations: data.results }));
      }

      this.setState({
        icon: <UnitIcon unit={unit} />,
      });
    }
  }

  getContent = () => {
    const {
      getLocaleText, unit, eventsData, intl,
    } = this.props;
    const { content, reservations } = this.state;
    switch (content) {
      case 'services':
        return <Services unit={unit} intl={intl} getLocaleText={getLocaleText} />;
      case 'events':
        return <Events eventsData={eventsData} />;
      case 'reservations':
        return <Reservations reservations={reservations} getLocaleText={getLocaleText} />;
      default:
        return null;
    }
  }

  render() {
    const {
      getLocaleText, unit, intl, classes,
    } = this.props;
    const { icon, titleId } = this.state;

    const topBar = (
      unit && (
        <>
          <DesktopComponent>
            <SearchBar placeholder={intl.formatMessage({ id: 'search.placeholder' })} />
            <TitleBar icon={icon} title={getLocaleText(unit.name)} />
          </DesktopComponent>
          <MobileComponent>
            <TitleBar icon={icon} title={getLocaleText(unit.name)} primary backButton />
          </MobileComponent>
        </>
      )
    );
    const head = titleId && (
      <HeadModifier>
        <title>
          {`${getLocaleText(unit.name)} 
          ${intl.formatMessage({ id: titleId })} | ${intl.formatMessage({ id: 'app.title' })}`}
        </title>
      </HeadModifier>
    );

    return (
      <>
        {head}
        <div className={classes.fullListContent}>
          {topBar}
          {this.getContent()}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const eventsData = state.event.data;
  const unit = state.selectedUnit.unit.data;
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
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

UnitFullListView.defaultProps = {
  unit: null,
  eventsData: { events: null, unit: null },
};

export default withStyles(styles)(withRouter(injectIntl(connect(
  mapStateToProps,
  { fetchUnitEvents },
)(UnitFullListView))));
