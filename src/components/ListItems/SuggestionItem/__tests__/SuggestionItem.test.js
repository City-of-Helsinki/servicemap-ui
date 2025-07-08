// // Link.react.test.js
import { Search } from '@mui/icons-material';
import { fireEvent } from '@testing-library/react';
import React from 'react';

import { getRenderWithProviders } from '../../../../../jestUtils';
import SuggestionItem from '../index';

// Generic required props for SimpleListItem
const mockProps = {
  text: 'Title text',
  subtitle: 'Subtitle text',
  icon: <Search />,
};

const renderWithProviders = getRenderWithProviders({});

describe('<SuggestionItem />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(
      <SuggestionItem {...mockProps} />
    );
    expect(container).toMatchSnapshot();
  });

  it('simulates mousedown event', () => {
    const mockCallBack = jest.fn();
    const { getByRole } = renderWithProviders(
      <SuggestionItem {...mockProps} handleItemClick={mockCallBack} />
    );

    fireEvent.click(getByRole('link'));

    expect(mockCallBack.mock.calls.length).toEqual(1);
  });

  it('simulates keyboard event', () => {
    const mockCallBack = jest.fn();
    const { getByRole } = renderWithProviders(
      <SuggestionItem {...mockProps} handleItemClick={mockCallBack} />
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
    const { container } = renderWithProviders(
      <SuggestionItem {...mockProps} />
    );

    const p = container.querySelectorAll('p');
    expect(p[0].textContent).toEqual(mockProps.text);
    expect(p[1].textContent).toEqual(mockProps.subtitle);
  });

  it('does set select correctly', () => {
    const { getAllByRole } = renderWithProviders(
      <>
        <SuggestionItem {...mockProps} />
        <SuggestionItem {...mockProps} selected />
      </>
    );
    const listItems = getAllByRole('link');
    expect(listItems[0].classList.contains('Mui-selected')).toBeFalsy();
    expect(listItems[1].classList.contains('Mui-selected')).toBeTruthy();
  });

  it('does set divider correctly', () => {
    const { getAllByRole } = renderWithProviders(
      <>
        <SuggestionItem {...mockProps} />
        <SuggestionItem {...mockProps} divider />
      </>
    );

    const listItems = getAllByRole('link');
    expect(listItems[0]).toBeInTheDocument();
    expect(listItems[1]).toBeInTheDocument();
  });

  it('does bold query correctly', () => {
    const { container } = renderWithProviders(
      <SuggestionItem {...mockProps} query="text" />
    );

    expect(container.querySelector('b').textContent).toEqual('text');
  });

  it('does use default accessibility attributes correctly', () => {
    const { container, getByRole } = renderWithProviders(
      <SuggestionItem {...mockProps} />
    );

    const srText = container.querySelectorAll('span')[1];
    const text = container.querySelectorAll('p')[0];
    const containsText =
      srText.textContent.indexOf(mockProps.text) !== -1 &&
      srText.textContent.indexOf(mockProps.subtitle) !== -1;

    // Expect screen reader texts to render correctly
    expect(containsText).toBeTruthy();
    // Expect aria-hidden attributes to be placed correctly
    expect(srText.getAttribute('aria-hidden')).toBeFalsy();
    expect(text.getAttribute('aria-hidden')).toBeTruthy();
    // Expect role to be set
    expect(getByRole('link').getAttribute('role')).toEqual('link');
  });

  it('does use given accessibility attributes correctly', () => {
    const { container } = renderWithProviders(
      <SuggestionItem {...mockProps} role="button" divider />
    );

    // Expect role to be set
    expect(container.querySelector('li').getAttribute('role')).toEqual(
      'button'
    );
    // Expect divider element to be hidden from screen readers
    expect(
      container.querySelectorAll('li')[1].getAttribute('aria-hidden')
    ).toBeTruthy();
  });
});
