// Link.react.test.js
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { fireEvent, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import themes, { paletteDefault } from '../../../themes';
import { initialState } from '../../../redux/reducers/user';
import finnishTranslations from '../../../i18n/fi';
import PaperButton from '../index';
import { getIcon } from '../../SMIcon';

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

const paperButtonProps = {
  messageID: "home.buttons.closeByServices",
  icon: getIcon('location'),
  link: true,
  onClick: () => {},
  subtitleID: "location.notAllowed",
};

const renderWithProviders = component => render(component, { wrapper: Providers });

describe('<PaperButton />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<PaperButton {...paperButtonProps} />);
    expect(container).toMatchSnapshot();
  });

  it('simulates click event', () => {
    const mockCallBack = jest.fn();
    const { container } = renderWithProviders(
      <PaperButton
        {...paperButtonProps}
        onClick={mockCallBack}
      />,
    );
    fireEvent.click(container.querySelector('button'));
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });

  it('does render default accessibility attributes correctly', () => {
    const { container } = renderWithProviders(
      <PaperButton messageID="home.buttons.closeByServices" />,
    );
    const buttonBase = container.querySelector('button');
    // Expect role to be link
    expect(buttonBase).toHaveAttribute('role', 'button');
    // Expect tabindex to be 0
    expect(buttonBase).toHaveAttribute('tabindex', '0');
    // Expect aria label
    const ariaLabel = buttonBase.getAttribute('aria-label')
    expect(ariaLabel).toContain(finnishTranslations['home.buttons.closeByServices']);
  });

  if('does render given accessibility attributes correctly', () => {
    const { container } = renderWithProviders(
      <PaperButton
        {...paperButtonProps}
        disabled
        aria-label="Test label"
      />,
    );
    const buttonBase = container.querySelector('button');
    // Expect role to be link
    expect(buttonBase).toHaveAttribute('role', 'link');
    // Expect tabindex to be 0
    expect(buttonBase).toHaveAttribute('tabindex', '0');
    // Expect aria label to be given prop
    expect(buttonBase).toHaveAttribute('aria-label', 'Test label');
    // Expect disabled to be true
    expect(buttonBase).toHaveAttribute('disabled', 'true');
  });
});
