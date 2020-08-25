// Link.react.test.js
import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { MuiThemeProvider } from '@material-ui/core';
import { IntlProvider, FormattedMessage } from 'react-intl';
import themes from '../../../../themes';
import FocusableSRLinks from '../index';

// Generic required props for SimpleListItem
const mockProps = {
  items: [
    {
      href: '#test-href',
      text: 'Title text',
      // text: <FormattedMessage id="fm.test" />,
    },
  ],
};

// Mock props for intl provider
const intlMock = {
  locale: 'en',
  messages: {
    'fm.test': 'FM test text',
  },
};

// eslint-disable-next-line react/prop-types
const Providers = ({ children }) => (
  <IntlProvider {...intlMock}>
    <MuiThemeProvider theme={themes.SMTheme}>
      {children}
    </MuiThemeProvider>
  </IntlProvider>
);

describe('<FocusableSRLinks />', () => {
  // let render;
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ wrappingComponent: Providers });
  });

  it('should work', () => {
    const component = shallow(<FocusableSRLinks {...mockProps} />).dive();
    expect(component).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const component = shallow(<FocusableSRLinks {...mockProps} />).dive();

    let link = component.find('a');
    expect(link.text()).toEqual(mockProps.items[0].text);

    // Check text rendering with FormattedMessage
    const component2 = shallow(
      <FocusableSRLinks
        items={[
          {
            href: '#test-href',
            text: <FormattedMessage id="fm.test" />,
          },
        ]}
      />,
    ).dive();
    // Dive through FormattedMessage and consumers
    link = component2.find(FormattedMessage).dive().dive();
    expect(link.text()).toEqual(intlMock.messages['fm.test']);
  });

  it('does set href correctly', () => {
    const component = shallow(<FocusableSRLinks {...mockProps} />).dive();

    const link = component.find('a');
    expect(link.props().href).toEqual(mockProps.items[0].href);
  });
});
