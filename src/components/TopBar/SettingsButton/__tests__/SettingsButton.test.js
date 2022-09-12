import React from 'react';
import SettingsButton from '../SettingsButton';
import { getRenderWithProviders } from '../../../../../jestUtils';


const mockProps = {
  'aria-haspopup': 'dialog',
  settingsOpen: 'citySettings',
  type: 'citySettings',
  classes: {},
  onClick: () => {},
};

const renderWithProviders = getRenderWithProviders({
  settings: {
    visuallyImpaired: false,
    colorblind: false,
    hearingAid: false,
    mapType: 'servicemap',
    mobility: 'none',
    cities: 'helsinki',
  },
});

describe('<SettingsButton />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<SettingsButton {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does use correct aria arrtibutes', () => {
    const { container } = renderWithProviders(<SettingsButton {...mockProps} />);
    /*
      The following aria-attributes are based on the accessibility testing report from 26.4.2021
    */
    // Expect button role to be button
    expect(container.querySelector('button')).toHaveAttribute('role', 'button');
    // Expect button aria-haspopup value to be dialog
    expect(container.querySelector('button')).toHaveAttribute('aria-haspopup', 'dialog');
  });
});
