// Link.react.test.js
import React from 'react';
import { IntlProvider } from 'react-intl';
import { createMount } from '@material-ui/core/test-utils';
import { MuiThemeProvider } from '@material-ui/core';
import ServiceMapButton from '../index';
import themes from '../../../../themes';

// Mock props for intl provider
const intlMock = {
  locale: 'en',
  messages: {
    'button.text': 'Button text',
  },
  wrapRichTextChunksInFragment: false,
};

// Generic required props for ServiceMapButton
const buttonMockProps = {
  onClick: () => {},
  role: 'button',
};

// eslint-disable-next-line react/prop-types
const Providers = ({ children }) => (
  <IntlProvider {...intlMock}>
    <MuiThemeProvider theme={themes.SMTheme}>
      {children}
    </MuiThemeProvider>
  </IntlProvider>
);

describe('<ServiceMapButton />', () => {
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
    const component = mount(
      <ServiceMapButton {...buttonMockProps}>Test</ServiceMapButton>,
    );
    expect(component).toMatchSnapshot();
  });

  it('does show text using children', () => {
    const component = mount(
      <ServiceMapButton {...buttonMockProps}>Test</ServiceMapButton>,
    );
    expect(component.text()).toEqual('Test');
  });

  it('does show text using intl message id', () => {
    const component = mount(
      <ServiceMapButton {...buttonMockProps} messageID="button.text" />,
    );
    expect(component.text()).toEqual(intlMock.messages['button.text']);
  });

  it('simulates click event', () => {
    const mockCallBack = jest.fn();
    const component = mount(
      <ServiceMapButton
        {...buttonMockProps}
        onClick={mockCallBack}
      />,
    );
    component.find('button').simulate('click');
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });

  it('does render default accessibility attributes correctly', () => {
    const component = mount(
      <ServiceMapButton
        {...buttonMockProps}
        messageID="button.text"
      />,
    );
    const buttonBase = component.find('ButtonBase');
    const p = component.find('p');
    // Expect aria-label to be same as given text
    expect(buttonBase.props()['aria-label']).toEqual(intlMock.messages['button.text']);
    // Expect visible text to be hidden from screen readers
    expect(p.props()['aria-hidden']).toEqual(true);
    // Expect visible text to be same as aria-label
    expect(p.text()).toEqual(buttonBase.props()['aria-label']);
  });

  it('does use given accessibility attributes correctly', () => {
    const component = mount(
      <ServiceMapButton
        {...buttonMockProps}
        aria-label="Testing label"
        role="link"
      />,
    );
    const buttonBase = component.find('ButtonBase');
    expect(buttonBase.props().role).toEqual('link');
    expect(buttonBase.props()['aria-label']).toEqual('Testing label');
  });
});
