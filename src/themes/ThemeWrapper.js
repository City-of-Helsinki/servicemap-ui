import { ThemeProvider } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';

import { selectThemeMode } from '../redux/selectors/user';
import themes from '.';

// Component to handle theme changes
function ThemeHandler({ children = null }) {
  const themeMode = useSelector(selectThemeMode);
  return (
    // Get correct theme setting from store
    <ThemeProvider
      theme={themeMode === 'dark' ? themes.SMThemeDark : themes.SMTheme}
    >
      {children}
    </ThemeProvider>
  );
}
ThemeHandler.propTypes = {
  children: PropTypes.node,
};

export default ThemeHandler;
