// Link.react.test.js
import React from 'react';
import { createMount } from '@material-ui/core/test-utils';
import { MuiThemeProvider } from '@material-ui/core';
import { IntlProvider } from 'react-intl';
import themes from '../../../../themes';
import PaginationComponent from '../index';

// Mock props for intl provider
const intlMock = {
  locale: 'en',
  messages: {
    'general.pagination.previous': 'Aiempi sivu',
    'general.pagination.next': 'Seuraava sivu',
    'general.pagination.openPage': 'Avaa sivu {count}',
    'general.pagination.currentlyOpenedPage': 'Sivu {count}, avattu',
  },
  wrapRichTextChunksInFragment: false,
};

// Generic required props for ResultItem
const mockProps = {
  current: 2,
  handlePageChange: jest.fn(),
  maxShownPages: 5,
  pageCount: 8,
};

// eslint-disable-next-line react/prop-types
const Providers = ({ children }) => (
  <IntlProvider {...intlMock}>
    <MuiThemeProvider theme={themes.SMTheme}>
      {children}
    </MuiThemeProvider>
  </IntlProvider>
);

describe('<PaginationComponent />', () => {
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
    const component = mount(<PaginationComponent {...mockProps} />);
    expect(component).toMatchSnapshot();
  });

  it('simulates handlePageChange on click event', () => {
    const mockCallBack = jest.fn((newCurrent, totalCount) => ({ newCurrent, totalCount }));
    const component = mount(<PaginationComponent {...mockProps} handlePageChange={mockCallBack} />);

    component.find('PageElement ButtonBase').at(2).simulate('click');
    expect(mockCallBack.mock.calls.length).toEqual(1);

    // Expect handlePageChange to get first argument (newCurrent) correctly
    expect(mockCallBack.mock.results[0].value.newCurrent).toEqual(3);
    // Expect handlePageChange to get second argument (totalCount) correctly
    expect(mockCallBack.mock.results[0].value.totalCount).toEqual(mockProps.pageCount);
  });

  it('does set active correctly', () => {
    const component = mount(<PaginationComponent {...mockProps} />);
    expect(component.find('PageElement ButtonBase').at(mockProps.current - 1).props().disabled).toBeTruthy();
  });

  it('does use default accessibility attributes correctly', () => {
    const component = mount(<PaginationComponent {...mockProps} current={1} />);

    const buttons = component.find('ButtonBase');

    // Test previous page button accessibility
    expect(buttons.at(0).props()['aria-label']).toEqual(intlMock.messages['general.pagination.previous']);
    expect(buttons.at(0).props().disabled).toBeTruthy();
    expect(buttons.at(0).props().role).toEqual('link');
    // Test next page button accessibility
    expect(buttons.at(1).props()['aria-label']).toEqual(intlMock.messages['general.pagination.next']);
    expect(buttons.at(1).props().disabled).toBeFalsy();
    expect(buttons.at(1).props().role).toEqual('link');

    // Expect page 1 button to have opened text
    expect(buttons.at(2).find('span').at(0).text()).toEqual('Sivu 1, avattu');
    // expect page 2 button to have open new page text
    expect(buttons.at(3).find('span').at(0).text()).toEqual('Avaa sivu 2');
  });
});
