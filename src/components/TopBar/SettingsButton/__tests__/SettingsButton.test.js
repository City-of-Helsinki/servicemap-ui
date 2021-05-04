import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { MuiThemeProvider, ButtonBase } from '@material-ui/core';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import SettingsButton from '../SettingsButton';
import themes from '../../../../themes';


const mockProps = {
  'aria-haspopup': 'dialog',
  settingsOpen: 'citySettings',
  type: 'citySettings',
  classes: {},
  onClick: () => {},
};

// Mock props for intl provider
const intlMock = {
  locale: 'en',
  messages: {
    'settings.citySettings': 'City',
    'settings.city.all': 'Show all',
  },
};

const mockStore = configureStore([]);

// eslint-disable-next-line react/prop-types
const Providers = ({ children }) => {
  const store = mockStore({
    settings: {
      cities: [],
      colorblind: false,
      hearingAid: false,
      visuallyImpaired: false,
    },
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


describe('<SettingsButton />', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ wrappingComponent: Providers });
  });

  it('should work', () => {
    const component = shallow(<SettingsButton {...mockProps} />);
    expect(component).toMatchSnapshot();
  });

  it('does use correct aria arrtibute', () => {
    const component = shallow(<SettingsButton {...mockProps} />);
    // Expect button role to be button
    expect(component.props().role).toEqual('button');
    // Expect button aria-haspopup value to be dialog
    expect(component.props()['aria-haspopup']).toEqual('dialog');
  });
});
