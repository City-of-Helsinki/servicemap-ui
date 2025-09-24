import React from 'react';

import { initialState } from '../../../../redux/reducers/user';
import { getRenderWithProviders } from '../../../../testUtils';
import ServiceItem from '../index';

const mockData = {
  name: {
    fi: 'yleiset kirjastot',
    sv: 'allmänna bibliotek',
    en: 'public libraries',
  },
  id: 813,
  clarification_enabled: false,
};

// Generic required props for SimpleListItem
const mockProps = {
  service: mockData,
};

const renderWithProviders = getRenderWithProviders({
  user: initialState,
  settings: {},
  service: {
    current: null,
  },
});

describe('<ServiceItem />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<ServiceItem {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does render accessibility attributes correctly', () => {
    const { container } = renderWithProviders(<ServiceItem {...mockProps} />);
    const items = container.querySelectorAll('li');
    const firstItem = items[0];
    const firstItemResultTitle = firstItem.querySelectorAll('p')[0];
    const dividerItem = items[1];

    // List item's image should be aria-hidden
    expect(
      firstItem.querySelector('img').getAttribute('aria-hidden')
    ).toBeTruthy();
    expect(firstItem.getAttribute('role')).toEqual('link');
    expect(firstItem.getAttribute('tabIndex')).toEqual('0');
    // expect(firstItemSRText.className.indexOf('ResultItem-title') > 0).toBeTruthy();
    // expect(firstItemResultTitle.className.indexOf('ResultItem-title') > 0).toBeTruthy();
    expect(firstItemResultTitle.getAttribute('aria-hidden')).toBeFalsy();
    expect(dividerItem.getAttribute('aria-hidden')).toBeTruthy();
  });
});
