import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { MobileComponent } from '../../layouts/WrapperComponents/WrapperComponents';
import { comparePath } from '../../utils/path';

const styles = {
  root: {
    color: 'rgba(255,255,255,0.54)',
    width: '100%',
    '&$selected': {
      color: '#ffffff',
    },
  },
  selected: {
    color: '#ffffff',
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
      // If pathname contains action.path
      if (comparePath(action.path, path)) {
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
      actions, classes, style, location,
    } = this.props;
    const path = location.pathname;
    const { value } = this.state;
    let show = false;
    // If current location equals action path show mobile navigation
    actions.forEach((action) => {
      if (comparePath(action.path, path)) {
        show = true;
      }
    });

    if (!show) {
      return null;
    }

    return (
      <MobileComponent>
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
              classes={{
                root: classes.root,
                selected: classes.selected,
              }}
              key={action.label}
              label={action.label}
              icon={action.icon}
            />
          ))
        }
        </BottomNavigation>
      </MobileComponent>
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
