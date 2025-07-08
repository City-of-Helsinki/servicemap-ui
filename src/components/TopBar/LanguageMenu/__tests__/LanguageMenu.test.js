// Link.react.test.js
import React from 'react';

import { getRenderWithProviders } from '../../../../../jestUtils';
import { initialState } from '../../../../redux/reducers/user';
import LanguageMenu from '../index';

const renderWithProviders = getRenderWithProviders({
  user: initialState,
  settings: {},
});

describe('<LanguageMenu />', () => {
  it('does render default accessibility attributes correctly', () => {
    const { container } = renderWithProviders(
      <LanguageMenu onClick={() => {}} />
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
