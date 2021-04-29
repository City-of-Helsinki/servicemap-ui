import React from 'react';
import { createMount } from '@material-ui/core/test-utils';
import { MuiThemeProvider } from '@material-ui/core';
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
    const component = mount(<SettingsButton {...mockProps} />);
    expect(component).toMatchSnapshot();
  });

  it('does use correct aria arrtibute', () => {
    const component = mount(<SettingsButton {...mockProps} />);

    const buttonBase = component.find('ForwardRef(ButtonBase)');
    // Expect button role to be button
    expect(buttonBase.props().role).toEqual('button');
    // Expect button aria-haspopup value to be dialog
    expect(buttonBase.props()['aria-haspopup']).toEqual('dialog');
  });
});
