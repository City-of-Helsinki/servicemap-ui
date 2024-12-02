import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import themes from '.';
import { selectThemeMode } from '../redux/selectors/user';

// Component to handle theme changes
const ThemeHandler = ({ children = null }) => {
  const themeMode = useSelector(selectThemeMode);
  return (// Get correct theme setting from store
    <ThemeProvider theme={themeMode === 'dark' ? themes.SMThemeDark : themes.SMTheme}>
      {children}
    </ThemeProvider>
  );
};
ThemeHandler.propTypes = {
  children: PropTypes.node,
};

export default ThemeHandler;
