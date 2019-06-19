/* eslint-disable quote-props */
export default {
  'app.title': 'Service map',
  'address': 'Address',

  // Event
  'event.nearby': 'Nearby events',
  'event.description': 'Description',
  'event.time': 'Date and time',
  'event.picture': 'Event picture',
  'event.title': 'Events',

  // Sorting
  'sorting.label': 'Order search results',
  'sorting.alphabetical.asc': 'Reversed alphabetical',
  'sorting.alphabetical.desc': 'Alphabetical',
  'sorting.match.desc': 'Relevance',

  // General
  'general.back': 'Back',
  'general.back.address': 'Back to address view',
  'general.back.home': 'Back to home view',
  'general.back.goToHome': 'Go to home view',
  'general.back.search': 'Back to search view',
  'general.back.service': 'Back to service view',
  'general.back.unit': 'Back to unit view',
  'general.back.event': 'Back to event view',
  'general.backToHome': 'Close search and return to beginning',
  'general.backToStart': 'Back to beginning of page',
  'general.home': 'Home',
  'general.noData': 'No data available',
  'general.loading': 'Loading',
  'general.showOnMap': 'Show on map',
  'general.pageTitles.home': 'Home view',
  'general.pageTitles.search': 'Search view',
  'general.pageTitles.unit': 'Unit view',
  'general.pageTitles.service': 'Service view',
  'general.pageTitles.event': 'Event view',
  'general.pageTitles.fullList': 'List view',
  // General - Pagination
  'general.pagination.previous': 'Previous page',
  'general.pagination.next': 'Next page',
  'general.pagination.openPage': 'Open page {count}',
  'general.pagination.currentlyOpenedPage': 'Page {count} currently opened',
  'general.pagination.pageCount': 'page {current} / {max}',

  'general.return.viewTitle': 'Return to beginning of main content',
  'general.skipToContent': 'Skip to content',
  'general.give.feedback': 'Give feedback on the Servicemap test version (link opens in a new tab)',
  'general.new.tab': 'Opens in new tab',
  'general.time.short': 'at',

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
  'unit.eServices': 'Electronic services', // TODO: verify
  'unit.reservations': 'Reservations',
  'unit.events': 'Events',
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
  'unit.more.reservations': 'Show all {count} reservations',
  'unit.more.services': 'Show all {count} services',
  'unit.more.events': 'Show all {count} events',

  // Search
  'search': 'Search',
  'search.info': `{count, plural,
                  =0 {no units}
                  one {# unit}
                  other {# units}
                } found`,
  'search.resultList': `{count, plural,
                  =0 {no results}
                  one {# result}
                  other {# results}
                }`,
  'search.results': `{count, plural,
                  =0 {No results found with given search}
                  one {# result found}
                  other {# results found}
                }`,
  'search.results.short': `{count, plural,
                  =0 {No results}
                  one {# result}
                  other {# results}
                }`,
  'search.results.units': `{count, plural,
                  =0 {no units found}
                  one {# unit found}
                  other {# units found}
                }`,
  'search.results.services': `{count, plural,
                  =0 {no services found}
                  one {# service found}
                  other {# services found}
                }`,
  'search.results.title': 'Search results',
  'search.input.placeholder': 'Search units',
  'search.loading.units': 'Searching units {count} / {max}',
  'search.loading.units.srInfo': 'Search loading {count} units',
  'search.notFound': 'No results found with given search',
  'search.started': 'Search started',

  // Service
  'service': 'Service',
  'service.plural': 'Services',
  'service.nearby': 'Nearby services',
  'service.units.empty': 'Service doesn\'t have units',
};
