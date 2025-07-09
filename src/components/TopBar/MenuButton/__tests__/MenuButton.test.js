import React from 'react';

import { getRenderWithProviders } from '../../../../../jestUtils';
import englishTranslations from '../../../../i18n/en';
import MenuButton from '../MenuButton';

const mockProps = {
  classes: {},
  drawerOpen: false,
  toggleDrawerMenu: () => {},
};

const renderWithProviders = getRenderWithProviders({});

describe('<MenuButton />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<MenuButton {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does use correct aria arrtibutes', () => {
    const { getByLabelText } = renderWithProviders(
      <MenuButton {...mockProps} />
    );
    /*
      The following aria-attributes are based on the accessibility testing report from 26.4.2021
    */
    // Expect button aria-haspopup value to be true
    expect(
      getByLabelText(englishTranslations['general.menu']).getAttribute(
        'aria-haspopup'
      )
    ).toEqual('true');
    // Expect button aria-label value to be Valikko
    expect(
      getByLabelText(englishTranslations['general.menu']).getAttribute(
        'aria-label'
      )
    ).toEqual(englishTranslations['general.menu']);
    // // Expect button aria-expanded value to be same as from props
    expect(
      getByLabelText(englishTranslations['general.menu']).getAttribute(
        'aria-expanded'
      )
    ).toEqual(`${mockProps.drawerOpen}`);
  });
});
