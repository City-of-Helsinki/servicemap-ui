import React from 'react';
import { createMount } from '@material-ui/core/test-utils';
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


describe('<MenuButton />', () => {
  let mount;

  beforeEach(() => {
    // Use mount since intl.formatMessage does not work with shallow
    mount = createMount({ wrappingComponent: Providers });
  });

  afterEach(() => {
    mount.cleanUp();
  });

  it('should work', () => {
    const component = mount(<MenuButton {...mockProps} />);
    expect(component).toMatchSnapshot();
  });

  it('does use correct aria arrtibutes', () => {
    const component = mount(<MenuButton {...mockProps} />);
    const button = component.find('ForwardRef(Button)');
    /*
      The following aria-attributes are based on the accessibility testing report from 26.4.2021
    */
    // Expect button aria-haspopup value to be true
    expect(button.props()['aria-haspopup']).toEqual('true');
    // Expect button aria-label value to be Valikko
    expect(button.props()['aria-label']).toEqual('Valikko');
    // Expect button aria-expanded value to be same as from props
    expect(button.props()['aria-expanded']).toEqual(mockProps.drawerOpen);
  });
});
