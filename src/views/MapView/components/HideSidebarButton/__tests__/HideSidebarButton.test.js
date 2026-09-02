import { ThemeProvider } from '@mui/material/styles';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { describe, expect, it, vi } from 'vitest';

import themes from '../../../../../themes';

const invalidateSize = vi.fn();

vi.mock('react-leaflet', () => ({
  useMap: () => ({ invalidateSize }),
}));

import HideSidebarButton from '../HideSidebarButton';

const messages = {
  'map.button.sidebar.hide': 'Hide sidebar',
  'map.button.sidebar.show': 'Show sidebar',
};

const renderComponent = (props = {}) =>
  render(
    <ThemeProvider theme={themes.SMTheme}>
      <IntlProvider locale="en" messages={messages}>
        <HideSidebarButton
          sidebarHidden={false}
          toggleSidebar={vi.fn()}
          {...props}
        />
      </IntlProvider>
    </ThemeProvider>
  );

describe('HideSidebarButton', () => {
  it('shows the "hide" label when the sidebar is visible', () => {
    renderComponent({ sidebarHidden: false });

    expect(screen.getByText('Hide sidebar')).toBeInTheDocument();
  });

  it('shows the "show" label when the sidebar is hidden', () => {
    renderComponent({ sidebarHidden: true });

    expect(screen.getByText('Show sidebar')).toBeInTheDocument();
  });

  it('toggles the sidebar and invalidates the map size on click', async () => {
    vi.useFakeTimers();
    const toggleSidebar = vi.fn();
    renderComponent({ toggleSidebar });

    fireEvent.click(screen.getByText('Hide sidebar'));
    expect(toggleSidebar).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1);
    expect(invalidateSize).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
