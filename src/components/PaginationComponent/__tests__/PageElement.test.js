// Link.react.test.js
import React from 'react';
import { createMount } from '@material-ui/core/test-utils';
import { MuiThemeProvider } from '@material-ui/core';
import { IntlProvider } from 'react-intl';
import themes from '../../../../themes';
import PageElement from '../PageElement';

// Mock props for intl provider
const intlMock = {
  locale: 'en',
  messages: {
    'general.pagination.openPage': 'Open page {count}',
    'general.pagination.currentlyOpenedPage': 'Sivu {count}, avattu',
  },
  wrapRichTextChunksInFragment: false,
};

// Generic required props for ResultItem
const mockProps = {
  number: 2,
  onClick: jest.fn(),
  isActive: false,
};

// eslint-disable-next-line react/prop-types
const Providers = ({ children }) => (
  <IntlProvider {...intlMock}>
    <MuiThemeProvider theme={themes.SMTheme}>
      {children}
    </MuiThemeProvider>
  </IntlProvider>
);

describe('<PageElement />', () => {
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
    const component = mount(<PageElement {...mockProps} />);
    expect(component).toMatchSnapshot();
  });

  it('simulates click event', () => {
    const mockCallBack = jest.fn();
    const component = mount(<PageElement {...mockProps} onClick={mockCallBack} />);

    component.find('ButtonBase').simulate('click');
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });

  it('simulates keyboard event', () => {
    const mockCallBack = jest.fn();
    const component = mount(<PageElement {...mockProps} onClick={mockCallBack} />);

    component.find('ButtonBase').simulate('keyDown', { which: 13 });
    component.find('ButtonBase').simulate('keyDown', { which: 32 });
    expect(mockCallBack.mock.calls.length).toEqual(2);
  });

  it('does show text correctly', () => {
    const component = mount(<PageElement {...mockProps} />);

    const p = component.find('p span');
    expect(p.at(1).text()).toEqual(`${mockProps.number}`);
  });

  it('does set active correctly', () => {
    const component = mount(<PageElement {...mockProps} isActive />);
    expect(component.find('ButtonBase').props().disabled).toBeTruthy();
  });

  it('does use default accessibility attributes correctly', () => {
    const component = mount(<PageElement {...mockProps} />);

    // Expect screen reader texts to render correctly
    const srText = component.find('p span').at(0).text();
    expect(srText).toEqual('Open page 2');

    // // Expect aria-hidden attributes to be placed correctly
    const spans = component.find('p span');
    expect(spans.at(0).props()['aria-hidden']).toBeFalsy();
    expect(spans.at(1).props()['aria-hidden']).toBeTruthy();

    // // Expect role to be set to link
    expect(component.find('ButtonBase').props().role).toEqual('link');

    // // Expect element to have tabIndex 0
    expect(component.find('ButtonBase').props().tabIndex).toEqual('0');
  });

  it('does use given accessibility attributes correctly', () => {
    const component = mount(
      <PageElement
        {...mockProps}
        isActive
      />,
    );

    const srText = component.find('p span').at(0).text();
    expect(srText).toEqual(`Sivu ${mockProps.number}, avattu`);

    // // Expect element to have tabIndex -1
    expect(component.find('ButtonBase').props().tabIndex).toEqual('-1');
  });
});
