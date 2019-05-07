/* eslint-disable quote-props */
export default {
  'app.title': 'Service map',
  'address': 'Address',

  // Event
  'event.nearby': 'Nearby events',

  // General
  'general.back': 'Back',
  'general.backToStart': 'Back to beginning of page',
  'general.home': 'Home',
  'general.back.home': 'Close search and return to beginning',
  'general.noData': 'No data available',
  'general.loading': 'Loading',
  'general.pageTitles.home': 'Home view',
  'general.pageTitles.search': 'Search view',
  'general.pageTitles.unit': 'Unit view',
  'general.pageTitles.service': 'Service view',
  // General - Pagination
  'general.pagination.previous': 'Previous page',
  'general.pagination.next': 'Next page',
  'general.pagination.openPage': 'Open page {count}',
  'general.pagination.currentlyOpenedPage': 'Page {count} currently opened',
  'general.pagination.pageCount': 'page {current} / {max}',

  'general.skipToContent': 'Skip to content',
  'general.give.feedback': 'Give feedback on the Servicemap test version (link opens in a new tab)',
  'general.new.tab': 'Opens in new tab',

  // Home
  'home.example.title': 'Example search phrases',
  'home.example.search': 'Search for',
  'home.message': 'Message from the developers',
  'home.send.feedback': 'Send feedback',

  // Map
  'map': 'Map',
  'map.transit.endStation': 'Terminus',

  // Unit
  'unit': 'Unit',
  'unit.accessibility.noInfo': 'No accessibility information', // TODO: verify
  'unit.accessibility.ok': 'No accessibility shortcomings', // TODO: verify
  'unit.accessibility.problems': `{count, plural,
                                    =0 {No accessibility shortcomings}
                                    one {# accessibility shortcoming}
                                    other {# accessibility shortcomings}
                                  }`, // TODO: verify
  'unit.data_source': 'Source: {data_source}',
  'unit.details.notFound': 'Unit info not found.',
  'unit.plural': 'Units',

  'unit.contact.info': 'Contact information',
  'unit.services': 'Services',
  'unit.e.services': 'Electronic services', // TODO: verify
  'unit.homepage': 'Home page',
  'unit.picture': 'Picture of unit: ',
  'unit.description': 'Unit description',
  'unit.address': 'Address',
  'unit.phone': 'Phone number',
  'unit.opening.hours': 'Opening hours',
  'unit.opening.hours.info': 'Additional information about opening hours', // TODO verify
  'unit.contact': 'Contact person',
  'unit.school.year': 'School year',
  'unit.opens.new.tab': '(new tab)',
  'unit.call.number': '(call)',

  // Search
  'search': 'Search',
  'search.info': `{count, plural,
                  =0 {no units}
                  one {# unit}
                  other {# units}
                } found`,
  'search.results': `{count, plural,
                  =0 {no results}
                  one {# result}
                  other {# results}
                }`,
  'search.input.placeholder': 'Search units',
  'search.loading.units': 'Searching units {count} / {max}',
  'search.loading.units.srInfo': 'Search loading {count} results',
  'search.started': 'Search started',

  // Service
  'service': 'Service',
  'service.nearby': 'Nearby services',
};
