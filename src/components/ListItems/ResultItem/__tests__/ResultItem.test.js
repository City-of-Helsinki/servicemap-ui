// Link.react.test.js
import React from 'react';
import { createMount } from '@material-ui/core/test-utils';
import { MuiThemeProvider } from '@material-ui/core';
import themes from '../../../../themes';
import ResultItem from '../index';

// Generic required props for ResultItem
const mockProps = {
  title: 'Title text',
  bottomText: 'Bottom text',
  distance: {
    text: '100m',
    srText: '100 metrin päässä',
  },
  subtitle: 'Subtitle text',
};

// eslint-disable-next-line react/prop-types
const Providers = ({ children }) => (
  <MuiThemeProvider theme={themes.SMTheme}>
    {children}
  </MuiThemeProvider>
);

describe('<ResultItem />', () => {
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
    const component = mount(<ResultItem {...mockProps} />);
    expect(component).toMatchSnapshot();
  });

  it('simulates click event', () => {
    const mockCallBack = jest.fn();
    const component = mount(<ResultItem {...mockProps} onClick={mockCallBack} />);

    component.find('ForwardRef(ListItem)').simulate('click');
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });

  it('simulates keyboard event', () => {
    const mockCallBack = jest.fn();
    const component = mount(<ResultItem {...mockProps} onClick={mockCallBack} />);

    component.find('ForwardRef(ListItem)').simulate('keyDown', { which: 13 });
    component.find('ForwardRef(ListItem)').simulate('keyDown', { which: 32 });
    expect(mockCallBack.mock.calls.length).toEqual(2);
  });

  it('does show text correctly', () => {
    const component = mount(<ResultItem {...mockProps} />);

    const p = component.find('p');
    expect(p.at(1).text()).toEqual(mockProps.title);
    expect(p.at(2).text()).toEqual(mockProps.distance.text);
    expect(p.at(3).text()).toEqual(mockProps.subtitle);
    expect(p.at(4).text()).toEqual(mockProps.bottomText);
  });

  it('does set select correctly', () => {
    const component = mount(<ResultItem {...mockProps} selected />);
    expect(component.find('ForwardRef(ListItem)').props().selected).toBeTruthy();
  });

  it('does set divider correctly', () => {
    const component = mount(<ResultItem {...mockProps} />);
    expect(component.find('ForwardRef(Divider)').exists()).toBeTruthy();
  });

  it('does use default accessibility attributes correctly', () => {
    const component = mount(<ResultItem {...mockProps} />);

    // Expect screen reader texts to render correctly
    const srText = component.find('p.ResultItem-srOnly').text();
    const containsText = srText.indexOf(mockProps.title) !== -1
      && srText.indexOf(mockProps.subtitle) !== -1
      && srText.indexOf(mockProps.distance.srText) !== -1
      && srText.indexOf(mockProps.bottomText) !== -1;
    expect(containsText).toBeTruthy();

    // Expect aria-hidden attributes to be placed correctly
    const paragraphs = component.find('p');
    expect(paragraphs.at(0).props()['aria-hidden']).toBeFalsy();
    expect(paragraphs.at(1).props()['aria-hidden']).toEqual('true');
    expect(paragraphs.at(2).props()['aria-hidden']).toEqual('true');
    expect(paragraphs.at(3).props()['aria-hidden']).toEqual('true');
    expect(paragraphs.at(4).props()['aria-hidden']).toEqual('true');

    // Expect role to be set
    expect(component.find('ForwardRef(ListItem)').props().role).toEqual('link');
    
    // Expect element to have tabIndex 0
    expect(component.find('ForwardRef(ListItem)').props().tabIndex).toEqual(0);
  });

  it('does use given accessibility attributes correctly', () => {
    const component = mount(
      <ResultItem
        {...mockProps}
        role="button"
        srLabel="screen reader label"
      />,
    );

    const srText = component.find('p.ResultItem-srOnly').text();
    const containsText = srText.indexOf(mockProps.title) !== -1
      && srText.indexOf(mockProps.subtitle) !== -1
      && srText.indexOf(mockProps.distance.srText) !== -1
      && srText.indexOf(mockProps.bottomText) !== -1
      && srText.indexOf('screen reader label') !== -1;

    // Expect screen reader texts to render correctly
    expect(containsText).toBeTruthy();
    // Expect role to be set
    expect(component.props().role).toEqual('button');
  });

  // Expect element to not put strings like "undefined" or "null" into element if values are missing
  it('doesn\'t show invalid texts if values missing', () => {
    const component = mount(
      <ResultItem
        {...mockProps}
        bottomText={null}
        distance={{}}
        subtitle={null}
        role="button"
      />,
    );

    const text = component.text();
    const textContainsInvalidText = text.indexOf('undefined') !== -1
      || text.indexOf('null') !== -1;
    const srText = component.find('p.ResultItem-srOnly').text();
    const srTextContainsInvalidText = srText.indexOf('undefined') !== -1
      || srText.indexOf('null') !== -1;

    // Expect element texts to render correctly
    expect(textContainsInvalidText).toBeFalsy();
    // Expect screen reader texts to render correctly
    expect(srTextContainsInvalidText).toBeFalsy();
  });
});
