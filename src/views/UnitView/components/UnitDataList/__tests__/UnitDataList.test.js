import React from 'react';
import { getRenderWithProviders } from '../../../../../../jestUtils';
import UnitDataList from '../UnitDataList';


const mockData = {
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
