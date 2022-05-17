// Link.react.test.js
import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { IntlProvider, FormattedMessage } from 'react-intl';
import themes from '../../../themes';
import FocusableSRLinks from '../index';

// Generic required props for SimpleListItem
const mockProps = {
  items: [
    {
      href: '#test-href',
      text: 'Title text',
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
    <ThemeProvider theme={themes.SMTheme}>
      {children}
    </ThemeProvider>
  </IntlProvider>
);

const renderWithProviders = component => render(component, { wrapper: Providers });

describe('<FocusableSRLinks />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<FocusableSRLinks {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { getByText } = renderWithProviders(
      <>
        <FocusableSRLinks {...mockProps} />
        <FocusableSRLinks
          items={[
            {
              href: '#test-href',
              text: <FormattedMessage id="fm.test" />,
            },
          ]}
        />
      </>,
    );

    expect(getByText(mockProps.items[0].text, { selector: 'a' }).text).toEqual(mockProps.items[0].text);
    expect(getByText(intlMock.messages['fm.test'], { selector: 'a' }).text).toEqual(intlMock.messages['fm.test']);
  });

  it('does set href correctly', () => {
    const { getByText } = renderWithProviders(<FocusableSRLinks {...mockProps} />);

    expect(getByText(mockProps.items[0].text).href).toEqual(`http://localhost/${mockProps.items[0].href}`);
  });
});
