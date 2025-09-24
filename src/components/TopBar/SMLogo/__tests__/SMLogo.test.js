// Link.react.test.js
import userEvent from '@testing-library/user-event';
import React from 'react';

import englishTranslations from '../../../../i18n/en';
import { initialState } from '../../../../redux/reducers/user';
import { getRenderWithProviders } from '../../../../testUtils';
import SMLogo from '../index';

const renderWithProviders = getRenderWithProviders({
  user: initialState,
  settings: {},
});

describe('<SMLogo />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<SMLogo />);
    expect(container).toMatchSnapshot();
  });

  it('simulates click event', async () => {
    const mockCallBack = vi.fn();
    const { container } = renderWithProviders(
      <SMLogo onClick={mockCallBack} />
    );
    const user = userEvent.setup();

    await user.click(container.querySelector('button'));

    expect(mockCallBack.mock.calls.length).toEqual(1);
  });

  it('does render default accessibility attributes correctly', () => {
    const { container } = renderWithProviders(<SMLogo onClick={() => {}} />);
    const buttonBase = container.querySelector('button');
    // Expect role to be link
    expect(buttonBase).toHaveAttribute('role', 'link');
    // Since we are mocking home path for location aria-current should be page
    expect(buttonBase).toHaveAttribute('aria-current', 'page');
    // Home logo which is image should containe image text in aria label
    // so aria label should contain "Palvelukartta" text in addition to action description
    expect(buttonBase).toHaveAttribute(
      'aria-label',
      englishTranslations['general.home.logo.ariaLabel']
    );
    // Expect visible text to be hidden from screen readers
    expect(buttonBase.querySelector('div')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
    expect(buttonBase.querySelector('div')).toHaveAttribute('role', 'img');
  });
});
