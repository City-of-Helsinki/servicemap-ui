import React from 'react';
import PropTypes from 'prop-types';
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
    const { classes, actions } = this.props;
    const { value } = this.state;

    return (
      <BottomNavigation
        value={value}
        onChange={this.handleChange}
        showLabels
        className={classes.root}
      >
        {
          actions
          && actions.map(action => (
            <BottomNavigationAction label={action.label} icon={action.icon} />
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
};

export default withStyles(styles)(MobileBottomNavigation);
