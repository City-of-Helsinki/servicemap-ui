// Link.react.test.js
import React from 'react';
import { fireEvent } from '@testing-library/react';
import ServiceMapButton from '../index';
import { getRenderWithProviders } from '../../../../jestUtils';
import englishTranslations from '../../../i18n/en';

// Generic required props for ServiceMapButton
const buttonMockProps = {
  onClick: () => {},
  role: 'button',
};

const renderWithProviders = getRenderWithProviders({});

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
      <ServiceMapButton {...buttonMockProps} messageID="app.title" />,
    );
    expect(getByRole('button')).toHaveTextContent(englishTranslations['app.title']);
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
        messageID="app.title"
      />,
    );
    const buttonBase = getByRole('button');
    const p = buttonBase.querySelector('p');
    // Expect aria-label to be same as given text
    expect(buttonBase).toHaveAttribute('aria-label', englishTranslations['app.title']);
    // Expect visible text to be hidden from screen readers
    expect(p).toHaveAttribute('aria-hidden', 'true');
    // Expect visible text to be same as aria-label
    expect(p).toHaveTextContent(englishTranslations['app.title']);
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
