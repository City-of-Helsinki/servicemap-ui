// Link.react.test.js
import React from 'react';
import { createMount } from '@material-ui/core/test-utils';
import { MuiThemeProvider } from '@material-ui/core';
import themes from '../../../../../themes';
import SimpleListItem from '../index';

// Generic required props for SimpleListItem
const mockProps = {
  text: 'Title text',
};

// eslint-disable-next-line react/prop-types
const Providers = ({ children }) => (
  <MuiThemeProvider theme={themes.SMTheme}>
    {children}
  </MuiThemeProvider>
);

describe('<SimpleListItem />', () => {
  // let render;
  let mount;

  beforeEach(() => {
    // render = createRender({ wrappingComponent: Providers });
    mount = createMount({ wrappingComponent: Providers });
  });

  afterEach(() => {
    mount.cleanUp();
  });

  const resetMount = () => {
    mount.cleanUp();
    mount = createMount({ wrappingComponent: Providers });
  };

  it('should work', () => {
    const component = mount(<SimpleListItem {...mockProps} />);
    expect(component).toMatchSnapshot();
  });

  it('simulates click event', () => {
    const mockCallBack = jest.fn();
    const component = mount(
      <SimpleListItem {...mockProps} handleItemClick={mockCallBack} button />
    );

    component.find('ListItem').simulate('click');
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });

  it('simulates keyboard event', () => {
    const mockCallBack = jest.fn();
    const component = mount(
      <SimpleListItem {...mockProps} handleItemClick={mockCallBack} button />
    );

    component.find('ListItem').simulate('keyDown', { which: 13 });
    component.find('ListItem').simulate('keyDown', { which: 32 });
    expect(mockCallBack.mock.calls.length).toEqual(2);
  });

  it('does show text correctly', () => {
    const component = mount(<SimpleListItem {...mockProps} />);

    const p = component.find('p');
    expect(p.at(0).text()).toEqual(mockProps.text);
  });

  it('does set select correctly', () => {
    let component = mount(<SimpleListItem {...mockProps} />);
    expect(component.find('ListItem').props().selected).toBeFalsy();

    resetMount();

    component = mount(<SimpleListItem {...mockProps} selected />);
    expect(component.find('ListItem').props().selected).toBeTruthy();
  });

  it('does set divider correctly', () => {
    let component = mount(<SimpleListItem {...mockProps} />);
    expect(component.find('Divider').exists()).toBeFalsy();

    resetMount();

    component = mount(<SimpleListItem {...mockProps} divider />);
    expect(component.find('Divider').exists()).toBeTruthy();
  });

  it('does use default accessibility attributes correctly', () => {
    const component = mount(<SimpleListItem {...mockProps} />);

    const srText = component.find('span').at(1);
    const text = component.find('p').at(0);

    // Expect screen reader texts to render correctly
    expect(component.find('ListItem').props()['aria-label'].indexOf(mockProps.text) !== -1).toBeTruthy();
    // Expect aria-hidden attributes to be placed correctly
    expect(srText.props()['aria-hidden']).toBeTruthy();
    expect(text.props()['aria-hidden']).toBeTruthy();
    // Expect role to be set
    expect(component.find('ListItem').props().role).toEqual(null);
    // Expect element to have tabIndex -1
    expect(component.find('ListItem').props().tabIndex).toEqual(-1);
  });

  it('does use given accessibility attributes correctly', () => {
    const component = mount(
      <SimpleListItem
        {...mockProps}
        role="button"
        srText="Screen reader text"
        divider
        button
      />,
    );

    const srText = component.find('span').at(1).text();
    const containsText = srText.indexOf('Screen reader text') !== -1;
    const alText = component.find('ListItem').props()['aria-label'];
    const alContainsText = alText.indexOf(mockProps.text) !== -1
    && alText.indexOf('Screen reader text') !== -1

    // Expect screen reader text to contain both text and srText values
    expect(alContainsText).toBeTruthy();
    // Expect screen reader only text to exist in separate span element
    expect(containsText).toBeTruthy();
    // Expect role to be set
    expect(component.props().role).toEqual('button');
    // Expect divider element to be hidden from screen readers
    expect(component.find('li').at(1).props()['aria-hidden']).toBeTruthy();
    // Expect element to have tabIndex 0
    expect(component.find('ListItem').props().tabIndex).toEqual(0);
  });
});
