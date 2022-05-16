import React from 'react';
import { createShallow } from '@mui/material/test-utils';
import { MuiThemeProvider } from '@mui/material';
import SettingsButton from '../SettingsButton';
import themes from '../../../../themes';


const mockProps = {
  'aria-haspopup': 'dialog',
  settingsOpen: 'citySettings',
  type: 'citySettings',
  classes: {},
  onClick: () => {},
};

// eslint-disable-next-line react/prop-types
const Providers = ({ children }) => (
  <MuiThemeProvider theme={themes.SMTheme}>
    {children}
  </MuiThemeProvider>
);


describe('<SettingsButton />', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ wrappingComponent: Providers });
  });

  it('should work', () => {
    const component = shallow(<SettingsButton {...mockProps} />);
    expect(component).toMatchSnapshot();
  });

  it('does use correct aria arrtibutes', () => {
    const component = shallow(<SettingsButton {...mockProps} />);
    /*
      The following aria-attributes are based on the accessibility testing report from 26.4.2021
    */
    // Expect button role to be button
    expect(component.props().role).toEqual('button');
    // Expect button aria-haspopup value to be dialog
    expect(component.props()['aria-haspopup']).toEqual('dialog');
  });
});
