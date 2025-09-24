// Link.react.test.js
import userEvent from '@testing-library/user-event';
import React from 'react';

import { getRenderWithProviders } from '../../../testUtils';
import PageElement from '../PageElement';

// Generic required props for ResultItem
const mockProps = {
  number: 2,
  onClick: vi.fn(),
  isActive: false,
};

const renderWithProviders = getRenderWithProviders({});

describe('<PageElement />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<PageElement {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('simulates click event', async () => {
    const mockCallBack = vi.fn();
    const { getByRole } = renderWithProviders(
      <PageElement {...mockProps} onClick={mockCallBack} />
    );

    const user = userEvent.setup();

    await user.click(getByRole('link'));

    expect(mockCallBack.mock.calls.length).toEqual(1);
  });

  it('simulates keyboard event', async () => {
    const mockCallBack = vi.fn();
    const { getByRole } = renderWithProviders(
      <PageElement {...mockProps} onClick={mockCallBack} />
    );
    const user = userEvent.setup();
    const listItem = getByRole('link');

    await user.click(listItem);

    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(mockCallBack.mock.calls.length).toEqual(3);
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<PageElement {...mockProps} />);
    expect(container.querySelector('span')).toHaveTextContent(
      `${mockProps.number}`
    );
  });

  it('does set active correctly', () => {
    const { getByRole } = renderWithProviders(
      <PageElement {...mockProps} isActive />
    );
    expect(getByRole('link')).toBeDisabled();
  });

  it('does use default accessibility attributes correctly', () => {
    const { container, getByRole } = renderWithProviders(
      <PageElement {...mockProps} />
    );

    // Expect screen reader texts to render correctly
    expect(container.querySelectorAll('p')[1]).toHaveTextContent('Open page 2');

    // // Expect aria-hidden attributes to be placed correctly
    expect(container.querySelectorAll('p')[1]).not.toHaveAttribute(
      'aria-hidden'
    );
    expect(container.querySelector('span')).toHaveAttribute('aria-hidden');

    // // Expect role to be set to link
    expect(getByRole('link')).toHaveAttribute('role', 'link');

    // // Expect element to have tabIndex 0
    expect(getByRole('link')).toHaveAttribute('tabindex', '0');
  });

  it('does use given accessibility attributes correctly', () => {
    const { container, getByRole } = renderWithProviders(
      <PageElement {...mockProps} isActive />
    );

    expect(container.querySelectorAll('p')[1]).toHaveTextContent(
      `Page ${mockProps.number} currently opened`
    );

    // Expect element to have tabIndex -1
    expect(getByRole('link')).toHaveAttribute('tabindex', '-1');
  });
});
