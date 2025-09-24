import { ThemeProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
// eslint-disable-next-line import/no-named-as-default
import configureStore from 'redux-mock-store';

import english from './i18n/en';
import themes from './themes';

const mockStore = configureStore([]);

// Mock props for intl provider
const intlMock = {
  locale: 'en',
  messages: english,
  wrapRichTextChunksInFragment: false,
};

const Providers =
  (mockState) =>
  ({ children }) => {
    const store = mockStore(mockState);
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={['/fi/']}>
          <IntlProvider {...intlMock}>
            <ThemeProvider theme={themes.SMTheme}>{children}</ThemeProvider>
          </IntlProvider>
        </MemoryRouter>
      </Provider>
    );
  };

export const getRenderWithProviders = (mockState) => (component) =>
  render(component, { wrapper: Providers(mockState) });
