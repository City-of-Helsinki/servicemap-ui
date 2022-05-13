import React from 'react';
import { render } from '@testing-library/react';
import { MuiThemeProvider } from '@material-ui/core';
import { IntlProvider } from 'react-intl';
import themes from '../../../../themes';
import MenuButton from '../MenuButton';


const mockProps = {
  classes: {},
  drawerOpen: false,
  toggleDrawerMenu: () => {},
};

const intlMock = {
  locale: 'en',
  messages: {
    'general.menu': 'Valikko',
  },
};

// eslint-disable-next-line react/prop-types
const Providers = ({ children }) => (
  <IntlProvider {...intlMock}>
    <MuiThemeProvider theme={themes.SMTheme}>
      {children}
    </MuiThemeProvider>
  </IntlProvider>
);

const renderWithProviders = component => render(component, { wrapper: Providers });


describe('<MenuButton />', () => {

  it('should work', () => {
    const { container } = renderWithProviders(<MenuButton {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does use correct aria arrtibutes', () => {
    const { getByLabelText } = renderWithProviders(<MenuButton {...mockProps} />);
    /*
      The following aria-attributes are based on the accessibility testing report from 26.4.2021
    */
    // Expect button aria-haspopup value to be true
    expect(getByLabelText('Valikko').getAttribute('aria-haspopup')).toEqual('true');
    // Expect button aria-label value to be Valikko
    expect(getByLabelText('Valikko').getAttribute('aria-label')).toEqual('Valikko');
    // // Expect button aria-expanded value to be same as from props
    expect(getByLabelText('Valikko').getAttribute('aria-expanded')).toEqual(`${mockProps.drawerOpen}`);
  });
});
