// // Link.react.test.js
import React from 'react';

import { getRenderWithProviders } from '../../../testUtils';
import SMRadio from '../index';

// Generic required props for SimpleListItem
const mockProps = {
  'aria-label': 'Aria label text',
  name: 'service',
  initialValue: 'none',
  controls: ['none', 'common', 'all'].map((service) => ({
    value: service,
    label: `label ${service}`,
  })),
  onChange: () => {},
};

const renderWithProviders = getRenderWithProviders({});

describe('<SMRadio />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<SMRadio {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  // it('simulates onChange event correctly', () => {
  //   const mockCallBack = vi.fn();
  //   const component = mount(<SMRadio {...mockProps} onChange={mockCallBack} />);

  //   component.find(RadioGroup).simulate('change', { value: 'common' });
  //   expect(mockCallBack.mock.calls.length).toEqual(1);
  // });

  it('does set RadioGroup correctly', () => {
    const { getByLabelText } = renderWithProviders(<SMRadio {...mockProps} />);

    // Group attributes
    expect(
      getByLabelText(mockProps['aria-label']).getAttribute('aria-label')
    ).toEqual(mockProps['aria-label']);

    expect(
      getByLabelText('label none', { selector: 'input' }).getAttribute('name')
    ).toEqual(mockProps.name);
    expect(getByLabelText('label none', { selector: 'input' }).value).toEqual(
      mockProps.initialValue
    );

    expect(
      getByLabelText('label common', { selector: 'input' }).getAttribute('name')
    ).toEqual(mockProps.name);
    expect(getByLabelText('label common', { selector: 'input' }).value).toEqual(
      'common'
    );

    expect(
      getByLabelText('label all', { selector: 'input' }).getAttribute('name')
    ).toEqual(mockProps.name);
    expect(getByLabelText('label all', { selector: 'input' }).value).toEqual(
      'all'
    );
  });
});
