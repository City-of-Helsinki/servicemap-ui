// CloseSuggestionButton.test.js
import React from 'react';
import { createMount, createShallow } from '@material-ui/core/test-utils';
import { MuiThemeProvider } from '@material-ui/core';
import { IntlProvider } from 'react-intl';
import themes from '../../../../themes';
import { CloseSuggestionButton } from '../CloseSuggestionButton';
import { ArrowDownward } from '@material-ui/icons';

// Mock props for intl provider
const intlMock = {
  locale: 'en',
  messages: {
    'search.suggestions.hideButton': 'Hide the list of suggestions',
  },
  wrapRichTextChunksInFragment: false,
};

// Generic required props for ResultItem
const mockProps = {
  onClick: () => {},
  onKeyPress: () => {},
  onKeyDown: () => {},
  icon: <ArrowDownward />,
  srOnly: false,
};

// eslint-disable-next-line react/prop-types
const Providers = ({ children }) => (
  <IntlProvider {...intlMock}>
    <MuiThemeProvider theme={themes.SMTheme}>
      {children}
    </MuiThemeProvider>
  </IntlProvider>
);

describe('<CloseSuggestionButton />', () => {
  // let render;
  let mount;
  let shallow;

  beforeEach(() => {
    // render = createRender({ wrappingComponent: Providers });
    mount = createMount({ wrappingComponent: Providers });
    shallow = createShallow({ wrappingComponent: Providers });
  });

  afterEach(() => {
    mount.cleanUp();
  });

  it('should work', () => {
    const component = shallow(<CloseSuggestionButton {...mockProps} />);
    expect(component).toMatchSnapshot();
  });

  it('simulates click event', () => {
    const mockCallBack = jest.fn();
    const component = mount(<CloseSuggestionButton {...mockProps} onClick={mockCallBack} />);

    component.find('div').simulate('click');
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });

  it('simulates keyboard event', () => {
    const mockCallBack = jest.fn();
    const component = mount(<CloseSuggestionButton {...mockProps} onKeyDown={mockCallBack} />);

    component.find('div').simulate('keyDown', { which: 13 });
    component.find('div').simulate('keyDown', { which: 32 });
    expect(mockCallBack.mock.calls.length).toEqual(2);

    // Sr only element
    const component2 = mount(<CloseSuggestionButton {...mockProps} onKeyPress={mockCallBack} srOnly />);

    component2.find('span').simulate('keyPress', { which: 13 });
    component2.find('span').simulate('keyPress', { which: 32 });
    expect(mockCallBack.mock.calls.length).toEqual(4);
  });

  it('does show text correctly', () => {
    const component = mount(<CloseSuggestionButton {...mockProps} />);

    const p = component.find('div p');
    expect(p.text()).toEqual(`${intlMock.messages['search.suggestions.hideButton']}`);
  });

  it('does use accessibility attributes correctly', () => {
    // Visible element
    const component = shallow(<CloseSuggestionButton {...mockProps} />);
    const button = component.find('div');

    expect(button.props()['role']).toEqual('button');
    expect(button.props()['aria-hidden']).toBeFalsy();
    expect(button.props().tabIndex).toEqual('0');

    // SrOnly element
    const srComponent = shallow(<CloseSuggestionButton {...mockProps} srOnly />);
    const span = srComponent;

    expect(span.props()['role']).toEqual('button');
    expect(span.props()['aria-hidden']).toBeFalsy();
    expect(span.props().tabIndex).toEqual('-1');
  });
});
