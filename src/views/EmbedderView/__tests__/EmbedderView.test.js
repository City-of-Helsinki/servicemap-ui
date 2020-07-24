// // Link.react.test.js
import React from 'react';
import { createMount, createShallow } from '@material-ui/core/test-utils';
import { MuiThemeProvider } from '@material-ui/core';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import themes from '../../../../themes';
import EmbedderView from '../index';
import rootReducer from '../../../redux/rootReducer';
import messagesFi from '../../../i18n/fi';

// Mock props for intl provider
const intlMock = {
  locale: 'fi',
  messages: messagesFi,
};

// Generic required props for SimpleListItemu
const mockProps = {
};

// eslint-disable-next-line react/prop-types
const Providers = ({ children }) => {
  // Create Redux store with initial state
  const store = createStore(rootReducer, applyMiddleware(thunk));
  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={[ '/fi/embedder/?bbox=60.142957578300575,24.899482727050785,60.197691512228864,24.983081817626957' ]}>
        <IntlProvider {...intlMock}>
          <MuiThemeProvider theme={themes.SMTheme}>
            {children}
          </MuiThemeProvider>
        </IntlProvider>
      </MemoryRouter>
    </Provider>
  )
};

describe('<EmbedderView />', () => {
  // let render;
  let mount;
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState')
  useStateSpy.mockImplementation((init) => [init, setState]);

  beforeEach(() => {
    // render = createRender({ wrappingComponent: Providers });
    mount = createMount({ wrappingComponent: Providers });
  });

  afterEach(() => {
    mount.cleanUp();
  });

  // const resetMount = () => {
  //   mount.cleanUp();
  //   mount = createMount({ wrappingComponent: Providers });
  // };

  it('simulates click event', () => {
    // const mockCallBack = jest.fn();
    const component = mount(<EmbedderView {...mockProps} />);
    // const instance = component.instance();
    const test = component.find('input[type="radio"]').at(4);
    console.log(test.text());
    test.simulate('click');
    expect(setState).toHaveBeenCalledWith('common');
    // expect(component.state().service).toBe('none');
    // instance.incrementCounter();
    // expect(component.state('counter')).toBe(1);

    // component.find('ListItem').simulate('click');
    // expect(mockCallBack.mock.calls.length).toEqual(1);
  });

  // it('simulates keyboard event', () => {
  //   const mockCallBack = jest.fn();
  //   const component = mount(<SuggestionItem {...mockProps} handleItemClick={mockCallBack} />);

  //   component.find('ListItem').simulate('keyDown', { key: 'enter', keyCode: 13, which: 13 });
  //   // Simulate keyUp to release SuggestionItem mouseDown state
  //   component.find('ListItem').simulate('keyUp', { key: 'enter', keyCode: 13, which: 13 });
  //   component.find('ListItem').simulate('keyDown', { key: 'space', keyCode: 32, which: 32 });
  //   expect(mockCallBack.mock.calls.length).toEqual(2);
  // });

  // it('does show text correctly', () => {
  //   const component = mount(<SuggestionItem {...mockProps} />);

  //   const p = component.find('p');
  //   expect(p.at(0).text()).toEqual(mockProps.text);
  //   expect(p.at(1).text()).toEqual(mockProps.subtitle);
  // });

  // it('does set select correctly', () => {
  //   let component = mount(<SuggestionItem {...mockProps} />);
  //   expect(component.find('ListItem').props().selected).toBeFalsy();

  //   resetMount();

  //   component = mount(<SuggestionItem {...mockProps} selected />);
  //   expect(component.find('ListItem').props().selected).toBeTruthy();
  // });

  // it('does set divider correctly', () => {
  //   let component = mount(<SuggestionItem {...mockProps} />);
  //   expect(component.find('Divider').exists()).toBeFalsy();

  //   resetMount();

  //   component = mount(<SuggestionItem {...mockProps} divider />);
  //   expect(component.find('Divider').exists()).toBeTruthy();
  // });

  // it('does bold query correctly', () => {
  //   const component = mount(<SuggestionItem {...mockProps} query="text" />);

  //   expect(component.find('b').text()).toEqual('text');
  // });

  // it('does use default accessibility attributes correctly', () => {
  //   const component = mount(<SuggestionItem {...mockProps} />);

  //   const srText = component.find('span').at(1);
  //   const text = component.find('p').at(0);
  //   const containsText = srText.text().indexOf(mockProps.text) !== -1
  //     && srText.text().indexOf(mockProps.subtitle) !== -1;

  //   // Expect screen reader texts to render correctly
  //   expect(containsText).toBeTruthy();
  //   // Expect aria-hidden attributes to be placed correctly
  //   expect(srText.props()['aria-hidden']).toBeFalsy();
  //   expect(text.props()['aria-hidden']).toBeTruthy();
  //   // Expect role to be set
  //   expect(component.find('ListItem').props().role).toEqual('link');
  //   // Expect element to have tabIndex 0
  //   expect(component.find('ListItem').props().tabIndex).toEqual('0');
  //   // Expect span element to have tabIndex -1
  //   expect(component.find('ListItem').find('span').at(0).props().tabIndex).toEqual('-1');
  // });

  // it('does use given accessibility attributes correctly', () => {
  //   const component = mount(
  //     <SuggestionItem
  //       {...mockProps}
  //       role="button"
  //       divider
  //     />,
  //   );

  //   // Expect role to be set
  //   expect(component.props().role).toEqual('button');
  //   // Expect divider element to be hidden from screen readers
  //   expect(component.find('li').at(1).props()['aria-hidden']).toBeTruthy();
  //   // Expect element to have tabIndex 0
  //   expect(component.find('ListItem').props().tabIndex).toEqual('0');
  // });
});
