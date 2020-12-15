// Link.react.test.js
import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { MuiThemeProvider } from '@material-ui/core';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import themes from '../../../../themes';
import ResultList from '../ResultList';
import { initialState } from '../../../../redux/reducers/user';

const mockData = [
  {
    accessibility_properties: [],
    accessibility_shortcoming_count: {},
    contract_type: {
      id: 'municipal_service',
      description: { fi: 'kunnallinen palvelu', sv: 'kommunal tjänst', en: 'municipal service' },
    },
    id: 63115,
    municipality: 'espoo',
    name: { fi: 'Lippulaivan kirjasto', sv: 'Lippulaivabiblioteket', en: 'Lippulaiva library' },
    object_type: 'unit',
    street_address: { fi: 'Merikarhunkuja 11', sv: 'Sjöbjörnsgränden 11', en: 'Merikarhunkuja 11' },
  },
  {
    accessibility_properties: [],
    accessibility_shortcoming_count: {},
    contract_type: {
      id: 'municipal_service',
      description: { fi: 'kunnallinen palvelu', sv: 'kommunal tjänst', en: 'municipal service' },
    },
    id: 62032,
    municipality: 'vantaa',
    name: {
      fi: 'Kivistön kirjasto',
      sv: 'Kivistö bibliotek',
      en: 'Kivistö Library',
    },
    object_type: 'unit',
    street_address: { fi: 'Topaasikuja 11', sv: 'Topasgränden 11', en: 'Topaasikuja 11' },
  },
];

// Generic required props for SimpleListItem
const mockProps = {
  beforeList: <p>Test before list</p>,
  customComponent: null,
  data: mockData,
  listId: 'testID',
  resultCount: 5,
  title: 'Title text',
  titleComponent: 'h3',
};

// Mock props for intl provider
const intlMock = {
  locale: 'en',
  messages: {
    'search.resultList': 'Search result text',
    'general.pagination.pageCount': 'Page {current} of {max}',
  },
};

const mockStore = configureStore([]);

// eslint-disable-next-line react/prop-types
const Providers = ({ children }) => {
  const store = mockStore({
    user: initialState,
    settings: {},
  });

  return (
    <Provider store={store}>
      <IntlProvider {...intlMock}>
        <MuiThemeProvider theme={themes.SMTheme}>
          {children}
        </MuiThemeProvider>
      </IntlProvider>
    </Provider>
  );
};

describe('<ResultList />', () => {
  // let render;
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ wrappingComponent: Providers });
  });

  it('should work', () => {
    const component = shallow(<ResultList {...mockProps} />);
    expect(component).toMatchSnapshot();
  });

  it('does render list', () => {
    const component = shallow(<ResultList {...mockProps} />);
    const count = component.find('injectIntl(WithStyles(Connect(UnitItem)))').length;
    expect(count === 2).toBeTruthy();
  });

  it('does render beforeList', () => {
    const component = shallow(<ResultList {...mockProps} />);
    const text = component.find('p').at(0).text();
    expect(text).toEqual('Test before list');
  });
});
