import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

const styles = {
  root: {
    width: '100%',
  },
};

class MobileBottomNavigation extends React.Component {
  state = {
    value: 0,
  };

  // Figure out initial selected value
  componentDidMount() {
    const { actions, location } = this.props;
    const path = location.pathname;

    actions.forEach((action, index) => {
      // If home continue
      if (action.path === '/') {
        return;
      }

      // If pathname contains action.path
      if (path.indexOf(action.path) === 3) {
        this.setState({ value: index });
      }
    });
  }

  handleChange = (event, value) => {
    const { actions } = this.props;
    const action = actions[value] && actions[value].onClick;

    // Run action
    if (action) {
      action(event);
    }

    this.setState({ value });
  };

  render() {
    const {
      actions, classes, style,
    } = this.props;
    const { value } = this.state;

    return (
      <BottomNavigation
        style={style}
        value={value}
        onChange={this.handleChange}
        showLabels
        className={classes.root}
      >
        {
          actions
          && actions.map(action => (
            <BottomNavigationAction
              key={action.label}
              label={action.label}
              icon={action.icon}
            />
          ))
        }
      </BottomNavigation>
    );
  }
}

MobileBottomNavigation.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    icon: PropTypes.node,
    onClick: PropTypes.func,
  })).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  style: PropTypes.objectOf(PropTypes.any),
};

MobileBottomNavigation.defaultProps = {
  style: {},
};

export default withRouter(withStyles(styles)(MobileBottomNavigation));
