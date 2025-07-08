// Link.react.test.js
import { fireEvent } from '@testing-library/react';
import React from 'react';

import { getRenderWithProviders } from '../../../../../jestUtils';
import { initialState } from '../../../../redux/reducers/user';
import ResultItem from '../index';

// Generic required props for ResultItem
const mockProps = {
  title: 'Title text',
  bottomText: 'Bottom text',
  distance: {
    text: '100m',
    srText: '100 metrin päässä',
  },
  subtitle: 'Subtitle text',
};

const renderWithProviders = getRenderWithProviders({
  user: initialState,
});

describe('<ResultItem />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<ResultItem {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('simulates click event', () => {
    const mockCallBack = jest.fn();
    const { getByRole } = renderWithProviders(
      <ResultItem {...mockProps} onClick={mockCallBack} />
    );

    fireEvent.click(getByRole('link'));

    expect(mockCallBack.mock.calls.length).toEqual(1);
  });

  // it('simulates keyboard event', () => {
  //   const mockCallBack = jest.fn();
  //   const component = renderWithProviders(<ResultItem {...mockProps} onClick={mockCallBack} />);

  //   component.find('ForwardRef(ListItem)').simulate('keyDown', { which: 13 });
  //   component.find('ForwardRef(ListItem)').simulate('keyDown', { which: 32 });
  //   expect(mockCallBack.mock.calls.length).toEqual(2);
  // });

  it('does show text correctly', () => {
    const { getAllByText } = renderWithProviders(<ResultItem {...mockProps} />);

    let texts = getAllByText(mockProps.title, { selector: 'p', exact: false });
    expect(texts[1].textContent).toEqual(mockProps.title);
    texts = getAllByText(mockProps.distance.text, {
      selector: 'p',
      exact: false,
    });
    expect(texts[0].textContent).toEqual(mockProps.distance.text);
    texts = getAllByText(mockProps.subtitle, { selector: 'p', exact: false });
    expect(texts[1].textContent).toEqual(mockProps.subtitle);
    texts = getAllByText(mockProps.bottomText, { selector: 'p', exact: false });
    expect(texts[1].textContent).toEqual(mockProps.bottomText);
  });

  it('does set select correctly', () => {
    const { getByRole } = renderWithProviders(
      <ResultItem {...mockProps} selected />
    );
    expect(
      getByRole('link', { selector: 'li' }).classList.contains('Mui-selected')
    ).toBeTruthy();
  });

  it('does set divider correctly', () => {
    const { container } = renderWithProviders(<ResultItem {...mockProps} />);
    // expect(getByRole('listitem', { selector: 'li'}).exists()).toBeTruthy();
    expect(
      container.querySelector('li[aria-hidden="true"]')
    ).toBeInTheDocument();
  });

  it('does use default accessibility attributes correctly', () => {
    const { container, getByRole } = renderWithProviders(
      <ResultItem {...mockProps} />
    );

    // Expect screen reader texts to render correctly
    const srText = container.querySelector('.ResultItem-srOnly').textContent;
    const containsText =
      srText.indexOf(mockProps.title) !== -1 &&
      srText.indexOf(mockProps.subtitle) !== -1 &&
      srText.indexOf(mockProps.distance.srText) !== -1 &&
      srText.indexOf(mockProps.bottomText) !== -1;
    expect(containsText).toBeTruthy();

    // Expect aria-hidden attributes to be placed correctly
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs[0].getAttribute('aria-hidden')).toBeFalsy();
    expect(paragraphs[1].getAttribute('aria-hidden')).toEqual('true');
    expect(paragraphs[2].getAttribute('aria-hidden')).toEqual('true');
    expect(paragraphs[3].getAttribute('aria-hidden')).toEqual('true');
    expect(paragraphs[4].getAttribute('aria-hidden')).toEqual('true');

    // Expect role to be set
    expect(getByRole('link', { selector: 'li' })).toBeInTheDocument();

    // Expect element to have tabIndex 0
    expect(getByRole('link', { selector: 'li' }).tabIndex).toEqual(0);
  });

  it('does use given accessibility attributes correctly', () => {
    const { container, getByRole } = renderWithProviders(
      <ResultItem {...mockProps} role="button" srLabel="screen reader label" />
    );

    const srText = container.querySelector('.ResultItem-srOnly').textContent;
    const containsText =
      srText.indexOf(mockProps.title) !== -1 &&
      srText.indexOf(mockProps.subtitle) !== -1 &&
      srText.indexOf(mockProps.distance.srText) !== -1 &&
      srText.indexOf(mockProps.bottomText) !== -1 &&
      srText.indexOf('screen reader label') !== -1;

    // Expect screen reader texts to render correctly
    expect(containsText).toBeTruthy();
    // Expect role to be set
    expect(getByRole('button')).toBeInTheDocument();
  });

  // Expect element to not put strings like "undefined" or "null" into element if values are missing
  it("doesn't show invalid texts if values missing", () => {
    const { container, getByRole } = renderWithProviders(
      <ResultItem
        {...mockProps}
        bottomText={null}
        distance={{}}
        subtitle={null}
        role="button"
      />
    );

    const text = getByRole('button').textContent;
    const textContainsInvalidText =
      text.indexOf('undefined') !== -1 || text.indexOf('null') !== -1;
    const srText = container.querySelector('.ResultItem-srOnly').textContent;
    const srTextContainsInvalidText =
      srText.indexOf('undefined') !== -1 || srText.indexOf('null') !== -1;

    // Expect element texts to render correctly
    expect(textContainsInvalidText).toBeFalsy();
    // Expect screen reader texts to render correctly
    expect(srTextContainsInvalidText).toBeFalsy();
  });
});
