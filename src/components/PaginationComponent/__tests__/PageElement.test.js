// Link.react.test.js
import { fireEvent } from '@testing-library/react';
import React from 'react';

import { getRenderWithProviders } from '../../../../jestUtils';
import PageElement from '../PageElement';

// Generic required props for ResultItem
const mockProps = {
  number: 2,
  onClick: jest.fn(),
  isActive: false,
};

const renderWithProviders = getRenderWithProviders({});

describe('<PageElement />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<PageElement {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('simulates click event', () => {
    const mockCallBack = jest.fn();
    const { getByRole } = renderWithProviders(
      <PageElement {...mockProps} onClick={mockCallBack} />
    );

    fireEvent.click(getByRole('link'));
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });

  it('simulates keyboard event', () => {
    const mockCallBack = jest.fn();
    const { getByRole } = renderWithProviders(
      <PageElement {...mockProps} onClick={mockCallBack} />
    );

    fireEvent.keyDown(getByRole('link'), {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      charCode: 13,
    });
    fireEvent.keyDown(getByRole('link'), {
      key: 'Space',
      code: 'Space',
      keyCode: 32,
      charCode: 32,
    });

    expect(mockCallBack.mock.calls.length).toEqual(2);
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
