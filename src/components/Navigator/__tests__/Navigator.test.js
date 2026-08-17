import { act } from '@testing-library/react';
import React, { createRef } from 'react';

import { getRenderWithProviders } from '../../../testUtils';
import { UnconnectedNavigator } from '../Navigator';

vi.mock('../../../redux/actions/breadcrumb', () => ({
  breadcrumbPop: vi.fn(),
  breadcrumbPush: vi.fn(),
  breadcrumbReplace: vi.fn(),
}));

const renderWithProviders = getRenderWithProviders({
  breadcrumb: [],
  searchResults: { previousSearch: null },
});

vi.mock('../../../utils/path', () => ({
  generatePath: vi.fn(() => '/fi'),
  isEmbed: vi.fn(() => false),
}));

describe('<Navigator />', () => {
  it('warns when push receives an invalid target', () => {
    const ref = createRef();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    renderWithProviders(
      <UnconnectedNavigator
        ref={ref}
        breadcrumb={[]}
        breadcrumbPush={vi.fn()}
        breadcrumbPop={vi.fn()}
      />
    );

    act(() => ref.current.push(null));

    expect(warn).toHaveBeenCalledWith(
      'Warning:',
      'Invalid target given to navigator push: null'
    );
    warn.mockRestore();
  });

  it('warns when replace receives an invalid target', () => {
    const ref = createRef();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    renderWithProviders(
      <UnconnectedNavigator
        ref={ref}
        breadcrumb={[]}
        breadcrumbPush={vi.fn()}
        breadcrumbPop={vi.fn()}
      />
    );

    act(() => ref.current.replace(null));

    expect(warn).toHaveBeenCalledWith(
      'Warning:',
      'Invalid target given to navigator replace'
    );
    warn.mockRestore();
  });
});
