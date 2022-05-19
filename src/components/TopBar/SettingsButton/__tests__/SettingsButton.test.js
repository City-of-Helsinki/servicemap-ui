import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import SettingsButton from '../SettingsButton';
import themes from '../../../../themes';
import initialState from '../../../../redux/rootReducer';
import { IntlProvider } from 'react-intl';


const mockProps = {
  'aria-haspopup': 'dialog',
  settingsOpen: 'citySettings',
  type: 'citySettings',
  classes: {},
  onClick: () => {},
};

// Mock props for intl provider
const intlMock = {
  locale: 'en',
  messages: {
    'settings.city.all': 'Cities all',
    'settings.citySettings': 'City settings',
  },
};

const mockStore = configureStore([]);

// eslint-disable-next-line react/prop-types
const Providers = ({ children }) => {
  const store = mockStore({
    settings: {
      visuallyImpaired: false,
      colorblind: false,
      hearingAid: false,
      mapType: 'servicemap',
      mobility: 'none',
      cities: 'helsinki',
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

describe('<SettingsButton />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<SettingsButton {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does use correct aria arrtibutes', () => {
    const { container } = renderWithProviders(<SettingsButton {...mockProps} />);
    /*
      The following aria-attributes are based on the accessibility testing report from 26.4.2021
    */
    // Expect button role to be button
    expect(container.querySelector('button')).toHaveAttribute('role', 'button');
    // Expect button aria-haspopup value to be dialog
    expect(container.querySelector('button')).toHaveAttribute('aria-haspopup', 'dialog');
  });
});
