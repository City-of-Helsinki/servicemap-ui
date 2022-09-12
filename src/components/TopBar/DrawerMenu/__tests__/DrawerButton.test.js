// Link.react.test.js
import React from 'react';
import { Search } from '@mui/icons-material';
import { fireEvent } from '@testing-library/react';
import DrawerButton from '../DrawerButton';
import { getRenderWithProviders } from '../../../../../jestUtils';

// Generic required props for ServiceMapButton
const buttonMockProps = {
  active: false,
  disabled: false,
  disableRipple: true,
  icon: <Search />,
  isOpen: false,
  text: 'Drawer button text',
  onClick: () => {},
  subText: 'Drawer button subtext',
};

const renderWithProviders = getRenderWithProviders({});

describe('<DrawerButton />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<DrawerButton {...buttonMockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text', () => {
    const { container } = renderWithProviders(<DrawerButton {...buttonMockProps} />);
    expect(container.querySelector('button')).toHaveTextContent(buttonMockProps.text);
  });

  it('simulates click event', () => {
    const mockCallBack = jest.fn();
    const { container } = renderWithProviders(
      <DrawerButton
        {...buttonMockProps}
        onClick={mockCallBack}
      />,
    );
    fireEvent.click(container.querySelector('button'));
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });

  it('does render default accessibility attributes correctly', () => {
    const { container } = renderWithProviders(
      <DrawerButton
        {...buttonMockProps}
      />,
    );
    const buttonBase = container.querySelector('button');
    // Expect role to be link
    expect(buttonBase).toHaveAttribute('role', 'link');
    // Expect aria-label to be same as given text
    expect(buttonBase).toHaveAttribute('aria-label', buttonMockProps.text);
    // Expect visible text to be hidden from screen readers
    expect(buttonBase.querySelector('span')).toHaveAttribute('aria-hidden', 'true');
  });

  it('does hide correctly when menu not open', () => {
    const { container } = renderWithProviders(
      <DrawerButton
        {...buttonMockProps}
        isOpen={false}
      />,
    );

    const buttonBase = container.querySelector('button');
    // Expect element to be aria-hidden when menu not opened
    expect(buttonBase).toHaveAttribute('aria-hidden', 'true');
    // Expect tabIndex to be -1 when menu not opened
    expect(buttonBase).toHaveAttribute('tabindex', '-1');
  });

  it('does show correctly when menu is opened', () => {
    const { container } = renderWithProviders(
      <DrawerButton
        {...buttonMockProps}
        isOpen
      />,
    );

    const buttonBase = container.querySelector('button');
    // Expect element to not be hidden when menu open
    expect(buttonBase).toHaveAttribute('aria-hidden', 'false');
    // Expect element to be in tab order when menu is open
    expect(buttonBase).toHaveAttribute('tabindex', '0');
  });

  // it('does render aria-label correctly when disabled', () => {
  //   const component = mount(
  //     <DrawerButton
  //       {...buttonMockProps}
  //       disabled
  //     />,
  //   );
  //   const buttonBase = component.find('ForwardRef(ButtonBase)');
  //   // Expect aria-label to be same as given text
  //   expect(buttonBase.props()['aria-label']).toEqual(`${buttonMockProps.text} ${buttonMockProps.subText}`);
  // });
});
