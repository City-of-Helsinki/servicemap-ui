import React from 'react';

import { getRenderWithProviders } from '../../../../../../jestUtils';
import UnitDataList from '../UnitDataList';

const mockData = {
  // Data for testing unit services
  max: 5,
  data: [
    {
      id: 'helmet:241163',
      name: { fi: 'Suomen kielen kielikahvila' },
    },
    {
      id: 'helmet:241975',
      name: { fi: 'R&A x Armas: Vanhenemisen estetiikka' },
    },
    {
      id: 'helmet:239092',
      name: {
        fi: 'Tietotekniikkaopastusta senioreille',
        sv: 'Digital handledning',
        en: 'Digital guidance for seniors',
      },
    },
    {
      id: 'helmet:242249',
      name: { fi: 'Marttojen neulontaklinikka: kaarrokeneule omille mitoille' },
    },
    {
      id: 'helmet:242089',
      name: { fi: 'Marttojen neulontaklinikka' },
    },
  ],
};

const mockData2 = {
  // Data for testing educational unit services
  data: [
    {
      clarification: null,
      name: {
        fi: 'A-ranska (lukion kieliohjelma)',
        sv: 'A-franska (gymnasiets språkprogram)',
        en: 'A-French (upper secondary school language programme)',
      },
      root_service_node: 1087,
      period: null,
      id: 10,
    },
    {
      clarification: null,
      name: {
        fi: 'A-ruotsi (lukion kieliohjelma)',
        sv: 'A-svenska (gymnasiets språkprogram)',
        en: 'A-Swedish (upper secondary school language programme)',
      },
      root_service_node: 1087,
      period: null,
      id: 11,
    },
    {
      clarification: null,
      name: {
        fi: 'A-saksa (lukion kieliohjelma)',
        sv: 'A-tyska (gymnasiets språkprogram)',
        en: 'A-German (upper secondary school language programme)',
      },
      root_service_node: 1087,
      period: null,
      id: 12,
    },
    {
      clarification: null,
      name: {
        fi: 'A-suomi (lukion kieliohjelma)',
        sv: 'A-finska (gymnasiets språkprogram)',
        en: 'A-Finnish (upper secondary school language programme)',
      },
      root_service_node: 1087,
      period: null,
      id: 13,
    },
    {
      clarification: null,
      name: {
        fi: 'B-englanti (lukion kieliohjelma)',
        sv: 'B-engelska (gymnasiets språkprogram)',
        en: 'B-English (upper secondary school language programme)',
      },
      root_service_node: 1087,
      period: null,
      id: 88,
    },
    {
      clarification: null,
      name: {
        fi: 'B-espanja (lukion kieliohjelma)',
        sv: 'B-spanska (gymnasiets språkprogram)',
        en: 'B-Spanish (upper secondary school language programme)',
      },
      root_service_node: 1087,
      period: null,
      id: 89,
    },
  ],
};

const mockProps = {
  // Props for testing unit services
  data: mockData,
  listLength: 3,
  type: 'events',
};

const mockProps2 = {
  // Props for testing educational unit services
  data: mockData2,
  listLength: 3,
  type: 'educationServices',
};

const renderWithProviders = getRenderWithProviders({
  selectedUnit: { unit: { data: { id: 51342 } } },
  user: { locale: 'en' },
  service: { current: null },
});

describe('<UnitDataList />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<UnitDataList {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does render events list with correct items', () => {
    const { getAllByTestId } = renderWithProviders(
      <UnitDataList {...mockProps} />
    );
    const count = getAllByTestId('EventItem').length;
    expect(count === mockProps.listLength).toBeTruthy();
  });

  it('renders correct event count number in button', () => {
    const { getByText } = renderWithProviders(<UnitDataList {...mockProps} />);
    const moreButton = getByText('Show more events', { exact: false });
    const numberInButtonText = parseInt(
      moreButton.textContent.match(/\d+/)[0],
      10
    );
    const { data, listLength } = mockProps;
    expect(numberInButtonText === data.max - listLength).toBeTruthy();
  });

  it('renders correct services count number in schoool services button', () => {
    const { getByText } = renderWithProviders(<UnitDataList {...mockProps2} />);
    const moreButton = getByText('Show more services', { exact: false });
    const numberInButtonText = parseInt(
      moreButton.textContent.match(/\d+/)[0],
      10
    );
    const { data, listLength } = mockProps2;
    expect(numberInButtonText === data.data.length - listLength).toBeTruthy();
  });
});
