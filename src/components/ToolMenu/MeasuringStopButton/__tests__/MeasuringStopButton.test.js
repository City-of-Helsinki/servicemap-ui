// Link.react.test.js
import React from 'react';
import { IntlProvider } from 'react-intl';
import { fireEvent, render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import MeasuringStopButton from '../index';
import themes from '../../../../themes';
import finnishTranslations from '../../../../i18n/fi';

// Mock props for intl provider
const intlMock = {
  locale: 'fi',
  messages: finnishTranslations,
  wrapRichTextChunksInFragment: false,
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

describe('<MeasuringStopButton />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(
      <MeasuringStopButton onClick={() => {}} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('simulates click event', () => {
    const mockCallBack = jest.fn();
    const { getByRole } = renderWithProviders(
      <MeasuringStopButton
        onClick={mockCallBack}
      />,
    );
    fireEvent.click(getByRole('button'));
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });

  it('does render accessibility attributes correctly', () => {
    const { getByRole } = renderWithProviders(
      <MeasuringStopButton />,
    );
    const buttonBase = getByRole('button');
    const p = buttonBase.querySelector('p');
    const contentText = finnishTranslations['tool.measuring.stop'];
    // Expect aria-label to be same as text content
    expect(buttonBase).toHaveAttribute('aria-label', contentText);
    // Expect aria-hidden to be false Eficode report 05-2022 page 47
    expect(buttonBase.getAttribute('aria-hidden')).toBeFalsy();
    // Expect visible text to be hidden from screen readers
    expect(p).toHaveAttribute('aria-hidden', 'true');
    // Expect visible text to be same as aria-label
    expect(p).toHaveTextContent(contentText);
  });
});
