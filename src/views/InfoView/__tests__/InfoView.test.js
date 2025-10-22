import { waitFor } from '@testing-library/react';

import { initialState } from '../../../redux/reducers/user';
import { getRenderWithProviders } from '../../../testUtils';
import InfoView from '../index';

const renderWithProviders = getRenderWithProviders({
  user: initialState,
  breadcrumb: [],
});

describe('<InfoView />', () => {
  it('should render content', async () => {
    const { container, getByText } = renderWithProviders(<InfoView />);

    // Wait for markdown content to load and render
    await waitFor(() => {
      expect(
        getByText(/Palvelukartalta löytyy Espoon, Helsingin/)
      ).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });
});
