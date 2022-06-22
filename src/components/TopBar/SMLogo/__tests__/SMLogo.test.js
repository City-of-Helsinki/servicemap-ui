// Link.react.test.js
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { fireEvent, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import themes from '../../../../themes';
import SMLogo from '../index';
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

describe('<SMLogo />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<SMLogo />);
    expect(container).toMatchSnapshot();
  });

  it('simulates click event', () => {
    const mockCallBack = jest.fn();
    const { container } = renderWithProviders(
      <SMLogo
        onClick={mockCallBack}
      />,
    );
    fireEvent.click(container.querySelector('button'));
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });

  it('does render default accessibility attributes correctly', () => {
    const { container } = renderWithProviders(
      <SMLogo onClick={() => {}} />,
    );
    const buttonBase = container.querySelector('button');
    // Expect role to be link
    expect(buttonBase).toHaveAttribute('role', 'link');
    // Since we are mocking home path for location aria-current should be page
    expect(buttonBase).toHaveAttribute('aria-current', 'page');
    // Home logo which is image should containe image text in aria label
    // so aria label should contain "Palvelukartta" text in addition to action description
    expect(buttonBase).toHaveAttribute('aria-label', 'Palvelukartta - Siirry etusivulle');
    // Expect visible text to be hidden from screen readers
    expect(buttonBase.querySelector('div')).toHaveAttribute('aria-hidden', 'true');
    expect(buttonBase.querySelector('div')).toHaveAttribute('role', 'img');
  });
});
