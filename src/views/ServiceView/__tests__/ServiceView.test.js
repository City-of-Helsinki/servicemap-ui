import { screen } from '@testing-library/react';

import rootReducer from '../../../redux/rootReducer';
import { getRenderWithProviders } from '../../../testUtils';
import ServiceView from '../ServiceView';

const baseState = rootReducer(undefined, { type: '@@INIT' });

describe('<ServiceView />', () => {
  it('renders the search bar while fetching without crashing', () => {
    const { container } = getRenderWithProviders(baseState)(
      <ServiceView fetchService={vi.fn()} />
    );

    expect(container).toBeInTheDocument();
  });

  it('renders the service title once a current service is set', () => {
    const stateWithService = {
      ...baseState,
      service: {
        ...baseState.service,
        current: { id: 1, name: { fi: 'Testipalvelu' } },
      },
    };

    getRenderWithProviders(stateWithService)(
      <ServiceView fetchService={vi.fn()} />
    );

    expect(screen.getAllByText('Testipalvelu').length).toBeGreaterThan(0);
  });

  it('renders nothing when embed is true', () => {
    const { container } = getRenderWithProviders(baseState)(
      <ServiceView fetchService={vi.fn()} embed />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
