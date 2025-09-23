// Link.react.test.js
import userEvent from '@testing-library/user-event';
import React from 'react';

import { getRenderWithProviders } from '../../../../../jestUtils';
import englishTranslations from '../../../../i18n/en';
import MeasuringStopButton from '../index';

const renderWithProviders = getRenderWithProviders({});

describe('<MeasuringStopButton />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(
      <MeasuringStopButton onClick={() => {}} />
    );
    expect(container).toMatchSnapshot();
  });

  it('simulates click event', async () => {
    const mockCallBack = jest.fn();
    const { getByRole } = renderWithProviders(
      <MeasuringStopButton onClick={mockCallBack} />
    );
    const user = userEvent.setup();

    await user.click(getByRole('button'));
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });

  it('does render accessibility attributes correctly', () => {
    const { getByRole } = renderWithProviders(<MeasuringStopButton />);
    const buttonBase = getByRole('button');
    const p = buttonBase.querySelector('p');
    const contentText = englishTranslations['tool.measuring.stop'];
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
