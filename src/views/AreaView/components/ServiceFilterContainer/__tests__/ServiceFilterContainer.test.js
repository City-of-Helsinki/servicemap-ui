import { ThemeProvider } from '@mui/material/styles';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { describe, expect, it, vi } from 'vitest';

import themes from '../../../../../themes';
import ServiceFilterContainer from '../ServiceFilterContainer';

const formatMessage = ({ id }) => id;
const keyboardHandler = (callback) => (event) => {
  if (event.key === 'enter') {
    callback();
  }
};

const renderComponent = (props = {}) =>
  render(
    <ThemeProvider theme={themes.SMTheme}>
      <IntlProvider
        locale="fi"
        messages={{
          'area.statisticalDistrict.service.filter.button':
            'Filter button label',
        }}
      >
        <ServiceFilterContainer
          title="Filter title"
          inputRef={{ current: { value: 'test' } }}
          keyboardHandler={keyboardHandler}
          handlefilterButtonClick={vi.fn()}
          filterValue=""
          setFilterValue={vi.fn()}
          formatMessage={formatMessage}
          {...props}
        />
      </IntlProvider>
    </ThemeProvider>
  );

describe('ServiceFilterContainer', () => {
  it('renders the given title', () => {
    renderComponent();

    expect(screen.getByText('Filter title')).toBeInTheDocument();
  });

  it('does not render a title when title is not a string', () => {
    renderComponent({ title: null });

    expect(screen.queryByText('Filter title')).not.toBeInTheDocument();
  });

  it('calls handlefilterButtonClick when the filter button is clicked', () => {
    const handlefilterButtonClick = vi.fn();
    renderComponent({ handlefilterButtonClick });

    fireEvent.click(screen.getByText('Filter button label'));

    expect(handlefilterButtonClick).toHaveBeenCalledTimes(1);
  });

  it('clears the filter value when the clear icon button is clicked', () => {
    const setFilterValue = vi.fn();
    const inputRef = { current: { value: 'test' } };
    renderComponent({ filterValue: 'test', setFilterValue, inputRef });

    fireEvent.click(screen.getByLabelText('search.cancelText'));

    expect(inputRef.current.value).toBe('');
    expect(setFilterValue).toHaveBeenCalledWith('');
  });
});
