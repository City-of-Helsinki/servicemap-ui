import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import themes from '../../../../themes';
import { initialState } from '../../../../redux/reducers/user';
import AddressItem from '../index';

const mockData = {
  "name": {
      "fi": "yleiset kirjastot",
      "sv": "allmänna bibliotek",
      "en": "public libraries"
  },
  "id": 813,
  "clarification_enabled": false,
};

// Generic required props for SimpleListItem
const mockProps = {
  service: mockData,
};

// Mock props for intl provider
const intlMock = {
  locale: 'en',
  messages: {},
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

describe('<AddressItem />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<AddressItem {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does render accessibility attributes correctly', () => {
    const { container } = renderWithProviders(<AddressItem {...mockProps} />);
    const items = container.querySelectorAll('li');
    const firstItem = items[0];
    const firstItemResultTitle = firstItem.querySelectorAll('p')[0];
    const dividerItem = items[1];

    // List item's image should be aria-hidden
    expect(firstItem.querySelector('span').getAttribute('aria-hidden')).toBeTruthy();
    expect(firstItem.getAttribute('role')).toEqual('link');
    expect(firstItem.getAttribute('tabIndex')).toEqual('0');
    expect(firstItemResultTitle.getAttribute('aria-hidden')).toBeFalsy();
    expect(dividerItem.getAttribute('aria-hidden')).toBeTruthy();
  });
});
