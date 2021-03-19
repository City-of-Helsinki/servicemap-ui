// Link.react.test.js
import React from 'react';
import { createMount } from '@material-ui/core/test-utils';
import { MuiThemeProvider, Typography } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import DrawerButton from '../DrawerButton';
import themes from '../../../../themes';

// Generic required props for ServiceMapButton
const buttonMockProps = {
  active: false,
  disabled: false,
  disableRipple: true,
  icon: <Search />,
  isOpen: false,
  text: 'Drawer button text',
  onClick: () => {},
  subText: 'Drawer button subtext',
};

// eslint-disable-next-line react/prop-types
const Providers = ({ children }) => (
  <MuiThemeProvider theme={themes.SMTheme}>
    {children}
  </MuiThemeProvider>
);

describe('<DrawerButton />', () => {
  // let render;
  let mount;

  beforeEach(() => {
    // render = createRender({ wrappingComponent: Providers });
    mount = createMount({ wrappingComponent: Providers });
  });

  afterEach(() => {
    mount.cleanUp();
  });

  it('should work', () => {
    const component = mount(<DrawerButton {...buttonMockProps} />);
    expect(component).toMatchSnapshot();
  });

  it('does show text', () => {
    const component = mount(<DrawerButton {...buttonMockProps} />);
    expect(component.find(Typography).text()).toEqual(buttonMockProps.text);
  });

  it('simulates click event', () => {
    const mockCallBack = jest.fn();
    const component = mount(
      <DrawerButton
        {...buttonMockProps}
        onClick={mockCallBack}
      />,
    );
    component.simulate('click');
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });

  it('does render default accessibility attributes correctly', () => {
    const component = mount(
      <DrawerButton
        {...buttonMockProps}
      />,
    );
    const buttonBase = component.find('ForwardRef(ButtonBase)');
    // Expect role to be link
    expect(buttonBase.props().role).toEqual('link');
    // Expect aria-label to be same as given text
    expect(buttonBase.props()['aria-label']).toEqual(buttonMockProps.text);
    // Expect visible text to be hidden from screen readers
    expect(component.find('span').props()['aria-hidden']).toEqual(true);
  });

  it('does hide correctly when menu not open', () => {
    const component = mount(
      <DrawerButton
        {...buttonMockProps}
        isOpen={false}
      />,
    );

    const buttonBase = component.find('ForwardRef(ButtonBase)');
    // Expect element to be aria-hidden when menu not opened
    expect(buttonBase.props()['aria-hidden']).toEqual(true);
    // Expect tabIndex to be -1 when menu not opened
    expect(buttonBase.props().tabIndex).toEqual(-1);
  });

  it('does show correctly when menu is opened', () => {
    const component = mount(
      <DrawerButton
        {...buttonMockProps}
        isOpen
      />,
    );

    const buttonBase = component.find('ForwardRef(ButtonBase)');
    // Expect element to not be hidden when menu open
    expect(buttonBase.props()['aria-hidden']).toEqual(false);
    // Expect element to be in tab order when menu is open
    expect(buttonBase.props().tabIndex).toEqual(0);
  });

  it('does render aria-label correctly when disabled', () => {
    const component = mount(
      <DrawerButton
        {...buttonMockProps}
        disabled
      />,
    );
    const buttonBase = component.find('ForwardRef(ButtonBase)');
    // Expect aria-label to be same as given text
    expect(buttonBase.props()['aria-label']).toEqual(`${buttonMockProps.text} ${buttonMockProps.subText}`);
  });
});
