import React from 'react';
import PropTypes from 'prop-types';
import {
  InputBase, Paper, withStyles, Icon,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import BackButton from '../BackButton';

const styles = theme => ({
  root: {
    margin: theme.spacing.unit,
    padding: theme.spacing.unit / 2,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeIn,
      duration: theme.transitions.duration.complex,
    }),
  },
  rootFocused: {
    margin: 0,
    transition: theme.transitions.create('margin', {
      duration: theme.transitions.duration.complex,
    }),
  },
  container: {
    alignItems: 'center',
    display: 'flex',
    flex: '0 0 auto',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  label: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  cssFocused: {
    outlineStyle: 'solid',
    outlineColor: 'blue',
    outlineWidth: 2,
  },
  input: {
    flex: '1 1 auto',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    padding: theme.spacing.unit,
  },
  iconButton: {
    flex: '0 1 auto',
    padding: theme.spacing.unit,
  },
  icon: {
    flex: '0 1 auto',
    padding: theme.spacing.unit,
  },
  borderBottom: {
    borderBottom: '1px solid rgba(0,0,0,0.2)',
  },
});


class SearchBar extends React.Component {
  state = {
    search: '',
    isActive: false,
  };

  onInputChange = (e) => {
    this.setState({ search: e.currentTarget.value });
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { onSubmit } = this.props;
    const { search } = this.state;
    if (onSubmit) {
      onSubmit(e, search);
    }
  }

  toggleAnimation = () => {
    const { isActive } = this.state;
    this.setState({ isActive: !isActive });
  }

  render() {
    const {
      classes, placeholder,
    } = this.props;
    const { search, isActive } = this.state;


    return (
      <Paper className={`${classes.root} ${isActive ? classes.rootFocused : ''}`} elevation={1} square>
        <form onSubmit={this.onSubmit} className={classes.container}>
          <BackButton
            className={classes.iconButton}
          />

          <InputBase
            classes={{
              focused: classes.cssFocused,
            }}
            className={classes.input}
            placeholder={placeholder}
            value={search}
            onChange={this.onInputChange}
            onFocus={this.toggleAnimation}
            onBlur={this.toggleAnimation}
          />

          <Icon className={classes.icon}>
            <Search />
          </Icon>
        </form>
      </Paper>
    );
  }
}

SearchBar.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,

};

export default withStyles(styles)(SearchBar);
