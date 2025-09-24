import React from 'react';

import { initialState } from '../../../../redux/reducers/user';
import { getRenderWithProviders } from '../../../../testUtils';
import AddressItem from '../index';

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

describe('<AddressItem />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<AddressItem {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does render accessibility attributes correctly', () => {
    const { container } = renderWithProviders(<AddressItem {...mockProps} />);
    const items = container.querySelectorAll('li');
    const firstItem = items[0];
    const firstItemResultTitle = firstItem.querySelectorAll('p')[0];
    const dividerItem = items[1];

    // List item's image should be aria-hidden
    expect(
      firstItem.querySelector('span').getAttribute('aria-hidden')
    ).toBeTruthy();
    expect(firstItem.getAttribute('role')).toEqual('link');
    expect(firstItem.getAttribute('tabIndex')).toEqual('0');
    expect(firstItemResultTitle.getAttribute('aria-hidden')).toBeFalsy();
    expect(dividerItem.getAttribute('aria-hidden')).toBeTruthy();
  });
});
