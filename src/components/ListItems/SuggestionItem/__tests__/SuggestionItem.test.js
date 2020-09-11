// // Link.react.test.js
import React from 'react';
import { createMount } from '@material-ui/core/test-utils';
import { MuiThemeProvider } from '@material-ui/core';
import { IntlProvider } from 'react-intl';
import { Search } from '@material-ui/icons';
import themes from '../../../../../themes';
import SuggestionItem from '../index';

// Mock props for intl provider
const intlMock = {
  locale: 'en',
  messages: {
    'search.arrowLabel': 'Arrow button label',
  },
  wrapRichTextChunksInFragment: false,
};

// Generic required props for SimpleListItem
const mockProps = {
  text: 'Title text',
  subtitle: 'Subtitle text',
  icon: <Search />,
};

// eslint-disable-next-line react/prop-types
const Providers = ({ children }) => (
  <IntlProvider {...intlMock}>
    <MuiThemeProvider theme={themes.SMTheme}>
      {children}
    </MuiThemeProvider>
  </IntlProvider>
);

describe('<SuggestionItem />', () => {
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
    const component = mount(<SuggestionItem {...mockProps} />);
    expect(component).toMatchSnapshot();
  });

  it('simulates click event', () => {
    const mockCallBack = jest.fn();
    const component = mount(<SuggestionItem {...mockProps} handleItemClick={mockCallBack} />);

    component.find('ListItem').simulate('click');
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });

  it('simulates keyboard event', () => {
    const mockCallBack = jest.fn();
    const component = mount(<SuggestionItem {...mockProps} handleItemClick={mockCallBack} />);

    component.find('ListItem').simulate('keyDown', { key: 'enter', keyCode: 13, which: 13 });
    // Simulate keyUp to release SuggestionItem mouseDown state
    component.find('ListItem').simulate('keyUp', { key: 'enter', keyCode: 13, which: 13 });
    component.find('ListItem').simulate('keyDown', { key: 'space', keyCode: 32, which: 32 });
    expect(mockCallBack.mock.calls.length).toEqual(2);
  });

  it('does show text correctly', () => {
    const component = mount(<SuggestionItem {...mockProps} />);

    const p = component.find('p');
    expect(p.at(0).text()).toEqual(mockProps.text);
    expect(p.at(1).text()).toEqual(mockProps.subtitle);
  });

  it('does set select correctly', () => {
    let component = mount(<SuggestionItem {...mockProps} />);
    expect(component.find('ListItem').props().selected).toBeFalsy();

    resetMount();

    component = mount(<SuggestionItem {...mockProps} selected />);
    expect(component.find('ListItem').props().selected).toBeTruthy();
  });

  it('does set divider correctly', () => {
    let component = mount(<SuggestionItem {...mockProps} />);
    expect(component.find('Divider').exists()).toBeFalsy();

    resetMount();

    component = mount(<SuggestionItem {...mockProps} divider />);
    expect(component.find('Divider').exists()).toBeTruthy();
  });

  it('does bold query correctly', () => {
    const component = mount(<SuggestionItem {...mockProps} query="text" />);

    expect(component.find('b').text()).toEqual('text');
  });

  it('does use default accessibility attributes correctly', () => {
    const component = mount(<SuggestionItem {...mockProps} />);

    const srText = component.find('span').at(1);
    const text = component.find('p').at(0);
    const containsText = srText.text().indexOf(mockProps.text) !== -1
      && srText.text().indexOf(mockProps.subtitle) !== -1;

    // Expect screen reader texts to render correctly
    expect(containsText).toBeTruthy();
    // Expect aria-hidden attributes to be placed correctly
    expect(srText.props()['aria-hidden']).toBeFalsy();
    expect(text.props()['aria-hidden']).toBeTruthy();
    // Expect role to be set
    expect(component.find('ListItem').props().role).toEqual('link');
    // Expect element to have tabIndex 0
    expect(component.find('ListItem').props().tabIndex).toEqual('0');
    // Expect span element to have tabIndex -1
    expect(component.find('ListItem').find('span').at(0).props().tabIndex).toEqual('-1');
  });

  it('does use given accessibility attributes correctly', () => {
    const component = mount(
      <SuggestionItem
        {...mockProps}
        role="button"
        divider
      />,
    );

    // Expect role to be set
    expect(component.props().role).toEqual('button');
    // Expect divider element to be hidden from screen readers
    expect(component.find('li').at(1).props()['aria-hidden']).toBeTruthy();
    // Expect element to have tabIndex 0
    expect(component.find('ListItem').props().tabIndex).toEqual('0');
  });
});
