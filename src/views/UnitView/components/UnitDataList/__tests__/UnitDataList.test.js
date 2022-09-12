import React from 'react';
import { getRenderWithProviders } from '../../../../../../jestUtils';
import UnitDataList from '../UnitDataList';


const mockData = {
  data: [
    {
      id: 'helmet:241163',
      name: { fi: 'Suomen kielen kielikahvila' },
      start_time: '2022-09-12T14:00:00Z',
      end_time: '2022-09-12T15:30:00Z',
    },
    {
      id: 'helmet:241975',
      name: { fi: 'R&A x Armas: Vanhenemisen estetiikka' },
      start_time: '2022-09-12T16:00:00Z',
      end_time: '2022-09-12T17:00:00Z',
    },
    {
      id: 'helmet:239092',
      name: {
        fi: 'Tietotekniikkaopastusta senioreille',
        sv: 'Digital handledning',
        en: 'Digital guidance for seniors',
      },
      start_time: '2022-09-13T08:00:00Z',
      end_time: '2022-09-13T11:00:00Z',
    },
    {
      id: 'helmet:242249',
      name: { fi: 'Marttojen neulontaklinikka: kaarrokeneule omille mitoille' },
      start_time: '2022-09-13T14:30:00Z',
      end_time: '2022-09-13T16:30:00Z',
    },
    {
      id: 'helmet:242089',
      start_time: '2022-09-13T14:30:00Z',
      end_time: '2022-09-13T16:30:00Z',
      name: { fi: 'Marttojen neulontaklinikka' },
    },
  ],
};


const mockProps = {
  data: mockData,
  listLength: 3,
  type: 'events',
};

const renderWithProviders = getRenderWithProviders({
  selectedUnit: { unit: { data: { id: 51342 } } },
  user: { locale: 'en' },
});


describe('<UnitDataList />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<UnitDataList {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does render events list with correct items', () => {
    const { getAllByRole } = renderWithProviders(<UnitDataList {...mockProps} />);
    const count = getAllByRole('link', { selector: 'li' }).length;
    expect(count === mockProps.listLength).toBeTruthy();
  });
});
