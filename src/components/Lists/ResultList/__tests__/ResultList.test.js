// Link.react.test.js
import React from 'react';

import { initialState } from '../../../../redux/reducers/user';
import { getRenderWithProviders } from '../../../../testUtils';
import ResultList from '../ResultList';

const mockData = [
  {
    accessibility_properties: [],
    accessibility_shortcoming_count: {},
    contract_type: {
      id: 'municipal_service',
      description: {
        fi: 'kunnallinen palvelu',
        sv: 'kommunal tjänst',
        en: 'municipal service',
      },
    },
    id: 63115,
    municipality: 'espoo',
    name: {
      fi: 'Lippulaivan kirjasto',
      sv: 'Lippulaivabiblioteket',
      en: 'Lippulaiva library',
    },
    object_type: 'unit',
    street_address: {
      fi: 'Merikarhunkuja 11',
      sv: 'Sjöbjörnsgränden 11',
      en: 'Merikarhunkuja 11',
    },
  },
  {
    accessibility_properties: [],
    accessibility_shortcoming_count: {},
    contract_type: {
      id: 'municipal_service',
      description: {
        fi: 'kunnallinen palvelu',
        sv: 'kommunal tjänst',
        en: 'municipal service',
      },
    },
    id: 62032,
    municipality: 'vantaa',
    name: {
      fi: 'Kivistön kirjasto',
      sv: 'Kivistö bibliotek',
      en: 'Kivistö Library',
    },
    object_type: 'unit',
    street_address: {
      fi: 'Topaasikuja 11',
      sv: 'Topasgränden 11',
      en: 'Topaasikuja 11',
    },
  },
];

// Generic required props for SimpleListItem
const mockProps = {
  beforeList: <p>Test before list</p>,
  customComponent: null,
  data: mockData,
  listId: 'testID',
  resultCount: 5,
  title: 'Title text',
  titleComponent: 'h3',
};

const renderWithProviders = getRenderWithProviders({
  user: initialState,
  settings: {},
});

describe('<ResultList />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<ResultList {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does render list', () => {
    const { getAllByRole } = renderWithProviders(<ResultList {...mockProps} />);
    const count = getAllByRole('link', { selector: 'li' }).length;
    expect(count === 2).toBeTruthy();
  });

  it('does render beforeList', () => {
    const { getByText } = renderWithProviders(<ResultList {...mockProps} />);
    const text = getByText('Test before list').textContent;
    expect(text).toEqual('Test before list');
  });

  it('does render accessibility attributes correctly', () => {
    const { getAllByRole } = renderWithProviders(<ResultList {...mockProps} />);
    const items = getAllByRole('link', { selector: 'li' });
    const firstItem = items[0];
    const firstItemSRText = firstItem.querySelectorAll('p')[0];
    const firstItemResultTitle = firstItem.querySelectorAll('p')[1];

    // List item's image should be aria-hidden
    expect(
      firstItem.querySelector('img').getAttribute('aria-hidden')
    ).toBeTruthy();
    expect(firstItem.getAttribute('role')).toEqual('link');
    expect(firstItem.getAttribute('tabIndex')).toEqual('0');
    expect(
      firstItemSRText.className.indexOf('ResultItem-title') > 0
    ).toBeTruthy();
    expect(
      firstItemResultTitle.className.indexOf('ResultItem-title') > 0
    ).toBeTruthy();
    expect(firstItemResultTitle.getAttribute('aria-hidden')).toBeTruthy();
  });
});
