// Link.react.test.js
import { fireEvent } from '@testing-library/react';
import React from 'react';

import { getRenderWithProviders } from '../../../../jestUtils';
import englishTranslations from '../../../i18n/en';
import PaginationComponent from '../index';

// Generic required props for ResultItem
const mockProps = {
  current: 2,
  handlePageChange: jest.fn(),
  maxShownPages: 5,
  pageCount: 8,
};

const renderWithProviders = getRenderWithProviders({});

describe('<PaginationComponent />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(
      <PaginationComponent {...mockProps} />
    );
    expect(container).toMatchSnapshot();
  });

  it('simulates handlePageChange on click event', () => {
    const mockCallBack = jest.fn((newCurrent, totalCount) => ({
      newCurrent,
      totalCount,
    }));
    const { getAllByRole } = renderWithProviders(
      <PaginationComponent {...mockProps} handlePageChange={mockCallBack} />
    );

    // component.find('PageElement ForwardRef(ButtonBase)').at(2).simulate('click');
    fireEvent.click(getAllByRole('link')[1]);
    expect(mockCallBack.mock.calls.length).toEqual(1);

    // Expect handlePageChange to get first argument (newCurrent) correctly
    expect(mockCallBack.mock.results[0].value.newCurrent).toEqual(3);
    // Expect handlePageChange to get second argument (totalCount) correctly
    expect(mockCallBack.mock.results[0].value.totalCount).toEqual(
      mockProps.pageCount
    );
  });

  it('does set active correctly', () => {
    const { getAllByRole } = renderWithProviders(
      <PaginationComponent {...mockProps} />
    );
    expect(getAllByRole('link')[mockProps.current + 1]).toBeDisabled();
  });

  it('does use default accessibility attributes correctly', () => {
    const { getAllByRole } = renderWithProviders(
      <PaginationComponent {...mockProps} current={1} />
    );

    const buttons = getAllByRole('link');

    // Test previous page button accessibility
    expect(buttons[0]).toHaveAttribute(
      'aria-label',
      englishTranslations['general.pagination.previous']
    );
    expect(buttons[0]).toBeDisabled();
    expect(buttons[0]).toHaveAttribute('role', 'link');
    // Test next page button accessibility
    expect(buttons[1]).toHaveAttribute(
      'aria-label',
      englishTranslations['general.pagination.next']
    );
    expect(buttons[1]).not.toBeDisabled();
    expect(buttons[1]).toHaveAttribute('role', 'link');

    // Expect page 1 button to have opened text
    expect(buttons[2].querySelectorAll('p')[1]).toHaveTextContent(
      'Page 1 currently opened'
    );
    // expect page 2 button to have open new page text
    expect(buttons[3].querySelectorAll('p')[1]).toHaveTextContent(
      'Open page 2'
    );
  });
});
