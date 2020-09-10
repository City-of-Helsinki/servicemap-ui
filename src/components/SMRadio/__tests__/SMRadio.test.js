// // Link.react.test.js
import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { MuiThemeProvider, RadioGroup, FormControlLabel } from '@material-ui/core';
import themes from '../../../../themes';
import SMRadio from '../index';

// Generic required props for SimpleListItem
const mockProps = {
  'aria-label': 'Aria label text',
  name: 'service',
  initialValue: 'none',
  controls: ['none', 'common', 'all'].map(service => ({
    value: service,
    label: `label ${service}`,
  })),
  onChange: () => {},
};

// eslint-disable-next-line react/prop-types
const Providers = ({ children }) => (
  <MuiThemeProvider theme={themes.SMTheme}>
    {children}
  </MuiThemeProvider>
);

describe('<SMRadio />', () => {
  let mount;

  beforeEach(() => {
    mount = createShallow({ wrappingComponent: Providers });
  });

  it('should work', () => {
    const component = mount(<SMRadio {...mockProps} />);
    expect(component).toMatchSnapshot();
  });

  it('simulates onChange event correctly', () => {
    const mockCallBack = jest.fn();
    const component = mount(<SMRadio {...mockProps} onChange={mockCallBack} />);

    component.find(RadioGroup).simulate('change', { value: 'common' });
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });

  it('does set RadioGroup correctly', () => {
    const component = mount(<SMRadio {...mockProps} />);

    const radioGroup = component.find(RadioGroup);
    expect(radioGroup.props().name).toEqual(mockProps.name);
    expect(radioGroup.props().value).toEqual(mockProps.initialValue);
    expect(radioGroup.props()['aria-label']).toEqual(mockProps['aria-label']);
  });

  it('does set FormControlLabels correctly', () => {
    const component = mount(<SMRadio {...mockProps} />);

    const label = component.find(FormControlLabel);
    expect(label.at(0).props().label).toEqual(mockProps.controls[0].label);
    expect(label.at(0).props().value).toEqual(mockProps.controls[0].value);
    expect(label.at(1).props().label).toEqual(mockProps.controls[1].label);
    expect(label.at(1).props().value).toEqual(mockProps.controls[1].value);
    expect(label.at(2).props().label).toEqual(mockProps.controls[2].label);
    expect(label.at(2).props().value).toEqual(mockProps.controls[2].value);
  });
});
