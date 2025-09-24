// Link.react.test.js
import userEvent from '@testing-library/user-event';
import React from 'react';

import { getRenderWithProviders } from '../../../../testUtils';
import SimpleListItem from '../index';

// Generic required props for SimpleListItem
const mockProps = {
  text: 'Title text',
};

const renderWithProviders = getRenderWithProviders({});

describe('<SimpleListItem />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(
      <SimpleListItem {...mockProps} />
    );
    expect(container).toMatchSnapshot();
  });

  it('simulates click event', async () => {
    const mockCallBack = vi.fn();
    const { getByRole } = renderWithProviders(
      <SimpleListItem {...mockProps} handleItemClick={mockCallBack} button />
    );

    const user = userEvent.setup();

    await user.click(getByRole('listitem'));

    expect(mockCallBack.mock.calls.length).toEqual(1);
  });

  it('simulates keyboard event', async () => {
    const mockCallBack = vi.fn();
    const { getByRole } = renderWithProviders(
      <SimpleListItem {...mockProps} handleItemClick={mockCallBack} button />
    );

    const user = userEvent.setup();
    const listItem = getByRole('listitem');

    await user.click(listItem);

    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    // One of the events in fired twice for some reason
    expect(mockCallBack.mock.calls.length).toEqual(3);
  });

  it('does show text correctly', () => {
    const { getByText } = renderWithProviders(
      <SimpleListItem {...mockProps} />
    );

    expect(getByText(mockProps.text)).toBeInTheDocument();
  });

  it('does set select correctly', () => {
    const { getAllByRole } = renderWithProviders(
      <>
        <SimpleListItem {...mockProps} />
        <SimpleListItem {...mockProps} selected />
      </>
    );
    expect(
      getAllByRole('listitem')[0].classList.contains('Mui-selected')
    ).toBeFalsy();

    expect(
      getAllByRole('listitem')[1].classList.contains('Mui-selected')
    ).toBeTruthy();
  });

  it('does set divider correctly', () => {
    const { container, getAllByRole } = renderWithProviders(
      <>
        <SimpleListItem {...mockProps} />
        <SimpleListItem {...mockProps} divider />
      </>
    );

    expect(
      getAllByRole('listitem')[0].querySelector('hr')
    ).not.toBeInTheDocument();
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('does use default accessibility attributes correctly', () => {
    const { container, getByText, getByRole } = renderWithProviders(
      <SimpleListItem {...mockProps} />
    );

    const srText = container.querySelectorAll('p')[1];
    const text = getByText(mockProps.text, { selector: 'p' });

    // Expect screen reader texts to render correctly
    expect(
      getByRole('listitem').textContent.indexOf(mockProps.text) !== -1
    ).toBeTruthy();
    // Expect aria-hidden attributes to be placed correctly
    expect(srText.getAttribute('aria-hidden')).toBeFalsy();
    expect(text.getAttribute('aria-hidden')).toBeFalsy();
    // Expect role to be set
    expect(getByRole('listitem').getAttribute('role')).toEqual(null);
    // Expect element to have tabIndex -1
    expect(getByRole('listitem').tabIndex).toEqual(-1);
  });

  it('does use given accessibility attributes correctly', () => {
    const { container, getByRole } = renderWithProviders(
      <SimpleListItem
        {...mockProps}
        role="button"
        srText="Screen reader text"
        divider
        button
      />
    );

    const srText = container.querySelectorAll('p')[1];
    const visibleText = container.querySelector('p');
    const srTextContains =
      srText.textContent.indexOf('Screen reader text') !== -1;
    const visibleTextContains =
      visibleText.textContent.indexOf(mockProps.text) !== -1;

    // Expect aria-hidden attributes to be placed correctly
    expect(srText.getAttribute('aria-hidden')).toBeFalsy();
    expect(visibleText.getAttribute('aria-hidden')).toBeFalsy();
    // Expect visible text to contain given attribute
    expect(visibleTextContains).toBeTruthy();
    // Expect screen reader only text to exist in separate span element
    expect(srTextContains).toBeTruthy();
    // Expect role to be set
    expect(getByRole('button')).toBeInTheDocument();
    // Expect divider element to be hidden from screen readers
    expect(
      container.querySelector('li[aria-hidden="true"')
    ).toBeInTheDocument();
    // Expect element to have tabIndex 0
    expect(getByRole('button').tabIndex).toEqual(0);
  });
});
