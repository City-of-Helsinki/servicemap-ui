import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { getRenderWithProviders } from '../../../../testUtils';
import MenuButton from '../MenuButton';

const renderWithProviders = getRenderWithProviders({});

const menuItems = [
  {
    key: 'first',
    id: 'first-menu-item',
    text: 'First item',
    icon: null,
    onClick: vi.fn(),
  },
];

describe('<MenuButton />', () => {
  it('keeps menu items accessible and closes on the focus sentinel', async () => {
    const { container, getByRole, queryByRole } = renderWithProviders(
      <MenuButton
        buttonText="Open menu"
        menuHeader="general.menu"
        menuItems={menuItems}
        menuAriaLabel="Tools"
        panelID="tools-panel"
        dataSm="ToolsMenu"
      >
        <span>Additional content</span>
      </MenuButton>
    );
    const user = userEvent.setup();

    await user.click(getByRole('button', { name: 'Open menu' }));

    const item = getByRole('link', { name: 'First item' });
    expect(item).not.toHaveAttribute('aria-hidden');
    const focusSentinel = container.querySelector('div[tabindex="0"]');
    expect(focusSentinel).not.toHaveAttribute('role');
    expect(focusSentinel).not.toHaveAttribute('aria-label');

    fireEvent.focus(focusSentinel);
    expect(queryByRole('region', { name: 'Tools' })).not.toBeInTheDocument();
  });
});
