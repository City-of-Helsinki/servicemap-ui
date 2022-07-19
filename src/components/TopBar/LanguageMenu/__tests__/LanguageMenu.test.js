// Link.react.test.js
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import themes from '../../../../themes';
import LanguageMenu from '../index';
import { initialState } from '../../../../redux/reducers/user';
import finnishTranslations from '../../../../i18n/fi';

// Mock props for intl provider
const intlMock = {
  locale: 'fi',
  messages: finnishTranslations,
};

const mockStore = configureStore([]);

// eslint-disable-next-line react/prop-types
const Providers = ({ children }) => {
  const store = mockStore({
    user: initialState,
    settings: {},
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

describe('<LanguageMenu />', () => {
  it('does render default accessibility attributes correctly', () => {
    const { container } = renderWithProviders(
      <LanguageMenu onClick={() => {}} />,
    );
    const buttonBase = container.querySelectorAll('button');
    buttonBase.forEach((button) => {
      // Expect button role to be link
      expect(button).toHaveAttribute('role', 'link');
      // Expect button tabindex to be 0
      expect(button).toHaveAttribute('tabindex', '0');
    });
    // Expect finnish button to have lang "fi" and aria-current "true"
    expect(buttonBase[0]).toHaveAttribute('lang', 'fi');
    expect(buttonBase[0]).toHaveAttribute('aria-current', 'true');
    // Expect english button to have lang "en" and aria-current "false"
    expect(buttonBase[1]).toHaveAttribute('lang', 'en');
    expect(buttonBase[1]).toHaveAttribute('aria-current', 'false');
    // Expect swedish button to have lang "sv" and aria-current "false"
    expect(buttonBase[2]).toHaveAttribute('lang', 'sv');
    expect(buttonBase[2]).toHaveAttribute('aria-current', 'false');
  });
});
