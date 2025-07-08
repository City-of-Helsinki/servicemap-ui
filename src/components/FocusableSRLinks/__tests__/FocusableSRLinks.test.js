// Link.react.test.js
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { getRenderWithProviders } from '../../../../jestUtils';
import englishTranslations from '../../../i18n/en';
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

const renderWithProviders = getRenderWithProviders({});

describe('<FocusableSRLinks />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(
      <FocusableSRLinks {...mockProps} />
    );
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
              text: <FormattedMessage id="app.title" />,
            },
          ]}
        />
      </>
    );

    expect(getByText(mockProps.items[0].text, { selector: 'a' }).text).toEqual(
      mockProps.items[0].text
    );
    expect(
      getByText(englishTranslations['app.title'], { selector: 'a' }).text
    ).toEqual(englishTranslations['app.title']);
  });

  it('does set href correctly', () => {
    const { getByText } = renderWithProviders(
      <FocusableSRLinks {...mockProps} />
    );

    expect(getByText(mockProps.items[0].text).href).toEqual(
      `http://localhost/${mockProps.items[0].href}`
    );
  });
});
