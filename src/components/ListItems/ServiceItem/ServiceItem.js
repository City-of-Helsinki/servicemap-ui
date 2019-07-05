import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { drawServiceIcon } from '../../../views/Map/utils/drawIcon';
import { getLocaleString } from '../../../redux/selectors/locale';
import { uppercaseFirst } from '../../../utils';
import SimpleListItem from '../SimpleListItem';
import { setNewCurrentService } from '../../../redux/actions/services';

class ServiceItem extends React.Component {
  state = {
    icon: <img alt="" src={null} style={{ height: 24 }} aria-hidden="true" />,
  };

  componentDidMount() {
    this.setState({ icon: <img alt="" src={drawServiceIcon()} style={{ height: 24 }} aria-hidden="true" /> });
  }

  render() {
    const {
      currentService, service, getLocaleText, navigator, setNewCurrentService, divider,
    } = this.props;
    const { icon } = this.state;
    let text = getLocaleText(service.name);

    if (service.clarification) {
      text += `: ${getLocaleText(service.clarification)}`;
    }
    return (
      <SimpleListItem
        button
        text={uppercaseFirst(text)}
        icon={icon}
        divider={divider}
        handleItemClick={(e) => {
          e.preventDefault();

          if (!currentService || currentService.id !== service.id) {
            setNewCurrentService(service);
          }
          if (navigator) {
            navigator.push('service', service.id);
          }
        }}
        role="link"
      />
    );
  }
}

// Listen to redux state
const mapStateToProps = (state) => {
  const { current } = state.service;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const { navigator } = state;
  return {
    currentService: current,
    getLocaleText,
    navigator,
  };
};

export default connect(
  mapStateToProps,
  { setNewCurrentService },
)(ServiceItem);

ServiceItem.propTypes = {
  currentService: PropTypes.objectOf(PropTypes.any),
  getLocaleText: PropTypes.func.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  service: PropTypes.objectOf(PropTypes.any).isRequired,
  setNewCurrentService: PropTypes.func.isRequired,
  divider: PropTypes.bool,
};

ServiceItem.defaultProps = {
  currentService: null,
  navigator: null,
  divider: true,
};
