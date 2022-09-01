import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import themes from '../../../../themes';
import { initialState } from '../../../../redux/reducers/user';
import EventItem from '../index';

const mockData = {
  "name": {
      "fi": "Tapahtuma kerho",
      "sv": "Tapahtuma kerho sv",
      "en": "Tapahtuma kerho en"
  },
  "location": {
    "id": 111,
    "name": {
      "fi": "Tapahtuma kerhon paikka",
      "sv": "Tapahtuma kerhon paikka sv",
      "en": "Tapahtuma kerhon paikka en"
    },
  },
  "start_time": "2022-08-31T18:00:00Z",
  "end_time": "2022-08-31T18:00:00Z",
  "id": 813,
};

// Generic required props for SimpleListItem
const mockProps = {
  event: mockData,
};

// Mock props for intl provider
const intlMock = {
  locale: 'en',
  messages: {
    'general.time.short': 'at',
  },
};

const mockStore = configureStore([]);

// eslint-disable-next-line react/prop-types
const Providers = ({ children }) => {
  const store = mockStore({
    user: initialState,
    settings: {},
    service: {
      current: null,
    },
  });

  return (
    <Provider store={store}>
      <IntlProvider {...intlMock}>
        <ThemeProvider theme={themes.SMTheme}>
          {children}
        </ThemeProvider>
      </IntlProvider>
    </Provider>
  );
};

const renderWithProviders = component => render(component, { wrapper: Providers });

describe('<EventItem />', () => {

  it('does render accessibility attributes correctly', () => {
    const { container } = renderWithProviders(<EventItem {...mockProps} />);
    const items = container.querySelectorAll('li');
    const firstItem = items[0];
    const firstItemResultTitle = firstItem.querySelectorAll('p')[0];
    const dividerItem = items[1];

    // List item's image should be aria-hidden
    expect(firstItem.querySelector('svg').getAttribute('aria-hidden')).toBeTruthy();
    expect(firstItem.getAttribute('role')).toEqual('link');
    expect(firstItem.getAttribute('tabIndex')).toEqual('0');
    expect(firstItemResultTitle.getAttribute('aria-hidden')).toBeFalsy();
    expect(dividerItem.getAttribute('aria-hidden')).toBeTruthy();
  });
});
