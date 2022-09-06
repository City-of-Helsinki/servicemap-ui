// Link.react.test.js
import React from 'react';
import { fireEvent } from '@testing-library/react';
import { initialState } from '../../../redux/reducers/user';
import englishTranslations from '../../../i18n/en';
import PaperButton from '../index';
import { getIcon } from '../../SMIcon';
import { getRenderWithProviders } from '../../../../jestUtils';

const paperButtonProps = {
  messageID: "home.buttons.closeByServices",
  icon: getIcon('location'),
  link: true,
  onClick: () => {},
  subtitleID: "location.notAllowed",
};

const renderWithProviders = getRenderWithProviders({
  user: initialState,
  settings: {},
});

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
    expect(ariaLabel).toContain(englishTranslations['home.buttons.closeByServices']);
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
