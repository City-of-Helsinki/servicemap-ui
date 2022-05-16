// Link.react.test.js
import React from 'react';
import { MuiThemeProvider } from '@mui/material';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
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

const renderWithProviders = component => render(component, { wrapper: Providers });

describe('<ResultList />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<ResultList {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does render list', () => {
    const { getAllByRole } = renderWithProviders(<ResultList {...mockProps} />);
    const count = getAllByRole('link', { selector: 'li' }).length;
    expect(count === 2).toBeTruthy();
  });

  it('does render beforeList', () => {
    const { getByText } = renderWithProviders(<ResultList {...mockProps} />);
    const text = getByText('Test before list').textContent;
    expect(text).toEqual('Test before list');
  });
});
