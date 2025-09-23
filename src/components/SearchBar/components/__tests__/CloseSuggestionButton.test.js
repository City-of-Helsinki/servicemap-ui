// CloseSuggestionButton.test.js
import { ArrowDownward } from '@mui/icons-material';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { getRenderWithProviders } from '../../../../../jestUtils';
import englishTranslations from '../../../../i18n/en';
import { CloseSuggestionButton } from '../CloseSuggestionButton';

// Generic required props for ResultItem
const mockProps = {
  onClick: () => {},
  onKeyPress: () => {},
  onKeyDown: () => {},
  icon: <ArrowDownward />,
  srOnly: false,
};

const renderWithProviders = getRenderWithProviders({});

describe('<CloseSuggestionButton />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(
      <CloseSuggestionButton {...mockProps} />
    );
    expect(container).toMatchSnapshot();
  });

  it('simulates click event', async () => {
    const mockCallBack = jest.fn();
    const { getByRole } = renderWithProviders(
      <CloseSuggestionButton {...mockProps} onClick={mockCallBack} />
    );

    const user = userEvent.setup();

    await user.click(getByRole('button'));
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });

  it('simulates keyboard event', async () => {
    const mockCallBack = jest.fn();
    const { getAllByRole } = renderWithProviders(
      <>
        <CloseSuggestionButton {...mockProps} onKeyDown={mockCallBack} />
        <CloseSuggestionButton
          {...mockProps}
          onKeyPress={mockCallBack}
          srOnly
        />
      </>
    );

    const user = userEvent.setup();

    await user.click(getAllByRole('button')[0]);

    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(mockCallBack.mock.calls.length).toEqual(2);

    await user.click(getAllByRole('button', { selector: 'p' })[1]);

    // Sr only element
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(mockCallBack.mock.calls.length).toEqual(4);
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(
      <CloseSuggestionButton {...mockProps} />
    );

    expect(container.querySelector('p')).toHaveTextContent(
      `${englishTranslations['search.suggestions.hideButton']}`
    );
  });

  it('does use accessibility attributes correctly', () => {
    // Visible element
    const { getAllByRole } = renderWithProviders(
      <>
        <CloseSuggestionButton {...mockProps} />
        <CloseSuggestionButton {...mockProps} srOnly />
      </>
    );

    expect(getAllByRole('button')[0]).toHaveAttribute('role', 'button');
    expect(getAllByRole('button')[0]).not.toHaveAttribute('aria-hidden');
    expect(getAllByRole('button')[0]).toHaveAttribute('tabindex', '0');

    // SrOnly element
    expect(getAllByRole('button')[1]).toHaveAttribute('role', 'button');
    expect(getAllByRole('button')[1]).not.toHaveAttribute('aria-hidden');
    expect(getAllByRole('button')[1]).toHaveAttribute('tabindex', '-1');
  });
});
