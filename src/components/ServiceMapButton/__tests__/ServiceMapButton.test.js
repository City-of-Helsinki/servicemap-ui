// Link.react.test.js
import React from 'react';
import { IntlProvider } from 'react-intl';
import { fireEvent, render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import ServiceMapButton from '../index';
import themes from '../../../themes';

// Mock props for intl provider
const intlMock = {
  locale: 'en',
  messages: {
    'button.text': 'Button text',
  },
  wrapRichTextChunksInFragment: false,
};

// Generic required props for ServiceMapButton
const buttonMockProps = {
  onClick: () => {},
  role: 'button',
};

// eslint-disable-next-line react/prop-types
const Providers = ({ children }) => (
  <IntlProvider {...intlMock}>
    <ThemeProvider theme={themes.SMTheme}>
      {children}
    </ThemeProvider>
  </IntlProvider>
);

const renderWithProviders = component => render(component, { wrapper: Providers });

describe('<ServiceMapButton />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(
      <ServiceMapButton {...buttonMockProps}>Test</ServiceMapButton>,
    );
    expect(container).toMatchSnapshot();
  });

  it('does show text using children', () => {
    const { getByRole } = renderWithProviders(
      <ServiceMapButton {...buttonMockProps}>Test</ServiceMapButton>,
    );
    expect(getByRole('button')).toHaveTextContent('Test');
  });

  it('does show text using intl message id', () => {
    const { getByRole } = renderWithProviders(
      <ServiceMapButton {...buttonMockProps} messageID="button.text" />,
    );
    expect(getByRole('button')).toHaveTextContent(intlMock.messages['button.text']);
  });

  it('simulates click event', () => {
    const mockCallBack = jest.fn();
    const { getByRole } = renderWithProviders(
      <ServiceMapButton
        {...buttonMockProps}
        onClick={mockCallBack}
      />,
    );
    fireEvent.click(getByRole('button'));
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });

  it('does render default accessibility attributes correctly', () => {
    const { getByRole } = renderWithProviders(
      <ServiceMapButton
        {...buttonMockProps}
        messageID="button.text"
      />,
    );
    const buttonBase = getByRole('button');
    const p = buttonBase.querySelector('p');
    // Expect aria-label to be same as given text
    expect(buttonBase).toHaveAttribute('aria-label', intlMock.messages['button.text']);
    // Expect visible text to be hidden from screen readers
    expect(p).toHaveAttribute('aria-hidden', 'true');
    // Expect visible text to be same as aria-label
    expect(p).toHaveTextContent(intlMock.messages['button.text']);
  });

  it('does use given accessibility attributes correctly', () => {
    const { getByRole } = renderWithProviders(
      <ServiceMapButton
        {...buttonMockProps}
        aria-label="Testing label"
        role="link"
      />,
    );
    const buttonBase = getByRole('link');
    expect(buttonBase).toHaveAttribute('role', 'link');
    expect(buttonBase).toHaveAttribute('aria-label', 'Testing label');
  });
});
