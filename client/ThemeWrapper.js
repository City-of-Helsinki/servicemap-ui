import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core';
import themes from '../themes';

const mapStateToProps = (state) => {
  const { user } = state;
  return {
    theme: user.theme,
  };
};

// Component to handle theme changes
const ThemeHandler = ({ children, theme }) => (
// Get correct theme setting from store
  <MuiThemeProvider theme={theme === 'dark' ? themes.SMThemeDark : themes.SMTheme}>
    {children}
  </MuiThemeProvider>
);
ThemeHandler.propTypes = {
  children: PropTypes.node,
  theme: PropTypes.string.isRequired,
};
ThemeHandler.defaultProps = {
  children: null,
};

const ThemeWrapper = connect(
  mapStateToProps,
)(ThemeHandler);

export default ThemeWrapper;
