/* eslint-disable quote-props */
export default {
  'app.title': 'Service map',
  'address': 'Address',

  // Accessibility
  'accessibility': 'Accessibility',
  'accessibility.details': 'Accessibility details',
  'accessibility.stamp': 'Accessibility acknowledged',
  'accessibility.shortcomings': 'Shortcomings',
  'accessibility.shortcomings.plural': `{count, plural,
                                =0 {no shortcomings}
                                one {# shortcoming}
                                other {# shortcomings}
                              }`,

  // Address
  'address.show.area': 'Show area on map',
  'address.list.geographical': 'Geographical',
  'address.list.protection': 'Protection',
  'address.list.health': 'Health',
  'address.list.education': 'Education',
  'address.list.neighborhood': 'Neighborhood',
  'address.list.postcode_area': 'Postcode area',
  'address.list.rescue_area': 'Rescue area',
  'address.list.rescue_district': 'Rescue district',
  'address.list.rescue_sub_district': 'Rescue subdistrict',
  'address.list.health_station_district': 'Health station district',
  'address.list.maternity_clinic_district': 'Maternity clinic district',
  'address.list.lower_comprehensive_school_district_fi': 'Finnish elementary school',
  'address.list.lower_comprehensive_school_district_sv': 'Swedish elementary school',
  'address.list.upper_comprehensive_school_district_fi': 'Finnish secondary school',
  'address.list.upper_comprehensive_school_district_sv': 'Swedish secondary school',
  'address.list.preschool_education_fi': 'Finnish preschool education',
  'address.list.preschool_education_sv': 'Swedish preschool education',
  'address.error': 'No address found',
  'address.nearby': 'Nearby',
  'address.districts': 'Areas',
  'address.plural': 'Addresses',


  // Event
  'event.nearby': 'Nearby events',
  'event.description': 'Description',
  'event.time': 'Date and time',
  'event.picture': 'Event picture',
  'event.title': 'Events',

  // Sorting
  'sorting.label': 'Order search results:',
  'sorting.accessibility.desc': 'Most accessibile',
  'sorting.alphabetical.asc': 'Reversed alphabetical',
  'sorting.alphabetical.desc': 'Alphabetical',
  'sorting.distance.asc': 'Closest',
  'sorting.match.desc': 'Relevance',

  // General
  'general.frontPage': 'Front page',
  'general.menu': 'Menu',
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
  'general.cancel': 'Cancel',
  'general.close': 'Close',
  'general.yes': 'Yes',
  'general.no': 'No',
  'general.closeSettings': 'Close settings',
  'general.fetching': 'Loading data...',
  'general.home': 'Home',
  'general.noData': 'No data available',
  'general.loading': 'Loading',
  'general.showOnMap': 'Show on map',
  'general.pageTitles.home': 'Home view',
  'general.pageTitles.search': 'Search view',
  'general.pageTitles.unit': 'Unit view',
  'general.pageTitles.service': 'Service view',
  'general.pageTitles.serviceTree': 'Service list',
  'general.pageTitles.event': 'Event view',
  'general.pageTitles.address': 'Address view',
  'general.pageTitles.list.events': 'Event list ',
  'general.pageTitles.list.reservations': 'Reservation list ',
  // General - Pagination
  'general.pagination.previous': 'Previous page',
  'general.pagination.next': 'Next page',
  'general.pagination.openPage': 'Open page {count}',
  'general.pagination.currentlyOpenedPage': 'Page {count} currently opened',
  'general.pagination.pageCount': 'page {current} / {max}',

  'general.previousSearch': 'Previous searches',
  'general.return.viewTitle': 'Return to beginning of main content',
  'general.skipToContent': 'Skip to content',
  'general.give.feedback': 'Give feedback on the Servicemap test version (link opens in a new tab)',
  'general.new.tab': 'Opens in new tab',
  'general.time.short': 'at',
  'general.save': 'Save',
  'general.save.changes': 'Save settings',
  'general.save.changes.done': 'Changes have been saved!',
  'general.save.confirmation': 'Would you like to save changes?',
  'general.search': 'Search',
  'general.distance.meters': 'Meters away',
  'general.distance.kilometers': 'Kilometers away',

  // Home
  'home.buttons.settings': 'City, map and accessibility settings',
  'home.buttons.services': 'Service list',
  'home.buttons.closeByServices': 'Nearby services',
  'home.example.title': 'Example search phrases',
  'home.example.search': 'Search for',
  'home.message': 'Message from the developers',
  'home.send.feedback': 'Send feedback',

  // Location
  'location.notFound': 'Location not found',
  'location.notAllowed': 'Location not allowed',

  // Map
  'map': 'Map',
  'map.ariaLabel': 'Map. Currently map information is only accessible visually.', // TODO: verify
  'map.transit.endStation': 'Terminus',
  'map.address.searching': 'Retreiving address...',
  'map.address.info': 'Address information',

  // Unit
  'unit': 'Unit',
  'unit.accessibility.noInfo': 'No accessibility information', // TODO: verify
  'unit.accessibility.noShortcomings': 'No accessibility shortcomings', // TODO: verify
  'unit.accessibility.ok': 'No accessibility shortcomings', // TODO: verify
  'unit.accessibility.problems': `{count, plural,
                                    =0 {No accessibility shortcomings}
                                    one {# accessibility shortcoming}
                                    other {# accessibility shortcomings}
                                  }`, // TODO: verify
  'unit.accessibility.unitNoInfo': 'Unit has not delivered any accessibility information.', // TODO: verify
  'unit.basicInfo': 'Information',
  'unit.data_source': 'Source: {data_source}',
  'unit.details.notFound': 'Unit info not found.',
  'unit.plural': 'Units',

  'unit.contact.info': 'Contact information',
  'unit.eServices': 'Electronic services', // TODO: verify
  'unit.reservations': 'Reservable objects', // TODO verify
  'unit.events': 'Events',
  'unit.events.count': `{count, plural,
    =0 {}
    one {# event}
    other {# events}
  }`,
  'unit.events.more': 'Show more events',
  'unit.homepage': 'Home page',
  'unit.homepage.missing': 'No home page provided',
  'unit.picture': 'Picture of unit: ',
  'unit.description': 'Unit description',
  'unit.address': 'Address',
  'unit.address.missing': 'No address provided',
  'unit.phone': 'Phone number',
  'unit.phone.missing': 'No phone number provided',
  'unit.email': 'Email',
  'unit.email.missing': 'No email provided',
  'unit.opening.hours': 'Opening hours',
  'unit.opening.hours.missing': 'No opening hours provided',
  'unit.opening.hours.info': 'Additional information about opening hours', // TODO verify
  'unit.contact': 'Contact person',
  'unit.school.year': 'School year',
  'unit.opens.new.tab': '(new tab)',
  // TODO verify
  'unit.reservations.count': `{count, plural,
    =0 {}
    one {# reservable object}
    other {# reservable objects}
  }`,
  'unit.reservations.more': 'Show more reservables', // TODO verify
  'unit.call.number': '(call)',
  'unit.more.reservations': 'Show all {count} objects', // TODO verify
  'unit.list.services': 'Services',
  'unit.list.events': 'Events',
  'unit.list.reservations': 'Reservable objects', // TODO verify
  'unit.services': 'Services',
  'unit.services.more': 'Show more services',
  // TODO verify
  'unit.services.count': `{count, plural,
    =0 {}
    one {# service}
    other {# services}
  }`,

  // Search
  'search': 'Search',
  'search.arrowLabel': 'Expand', // TODO verify
  'search.cancelText': 'Clear search text',
  'search.notFoundWith': 'No results for search "{query}".',
  'search.placeholder': 'Search for services or units',
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
  'search.resultInfo': 'Search information',
  'search.searchField': 'Search field',
  'search.results.title': 'Search results',
  'search.input.placeholder': 'Search units',
  'search.loading.units': 'Searching units {count} / {max}',
  'search.loading.units.srInfo': 'Search loading {count} units',
  'search.notFound': 'No results found with given search',
  'search.started': 'Search started',
  'search.infoText': '{count} Search results',
  'search.infoTextSR': 'Showing {count} results for search query: ',
  'search.infoTextSRNode': 'Showing {count} results for services: ',
  'search.searchbar.headerText': 'Pääkaupunkiseudun kaikki julkiset palvelut ulottuvillasi', // TODO: Translate
  'search.searchbar.infoText': 'Search for services, units or addresses', // TODO: Verify
  'search.suggestions.suggest': 'Did you mean..?',
  'search.suggestions.expand': 'Search suggestions',
  'search.suggestions.loading': 'Loading suggestions',
  'search.suggestions.error': 'No suggestions',
  'search.suggestions.suggestions': '{count} suggestions',
  'search.suggestions.expandSuggestions': '{count} suggestions',
  'search.suggestions.results': '{count} results',
  'search.suggestions.history': '{count} items in search history',
  'search.suggestions.noHistory': 'No previous searches',
  'search.tryAgain': 'Try searching again',
  'search.tryAgainBody.spelling': 'check spelling',
  'search.tryAgainBody.city': 'check city choices',
  'search.tryAgainBody.service': 'write name of service',
  'search.tryAgainBody.address': 'write address close to service you are looking for',
  'search.tryAgainBody.keyword': 'write keywords',
  'search.expand': 'Expand search', // TODO: verify
  'search.closeExpand': 'Return to search',


  // Service
  'service': 'Service',
  'service.plural': 'Services',
  'service.nearby': 'Nearby services',
  'service.units.empty': 'Service doesn\'t have units',
  'service.tab': 'Services and events',

  // Service tree
  'services': 'Palveluluettelo', // TODO: translate
  'services.selections': `{count, plural,
      one {Olet thenyt (#) valinnan}
      other {Olet thenyt (#) valintaa}
    }`, // TODO: translate
  'services.selections.delete': 'Poista kaikki valinnat', // TODO: translate
  'services.search': 'Tee haku', // TODO: translate

  // Settings
  'settings': 'Settings',
  'settings.citySettings': 'City',
  'settings.citySettings.long': 'City settings',
  'settings.mapSettings': 'Map setttings',
  'settings.mapSettings.long': 'Map setttings',
  'settings.accessibilitySettings': 'Accessibility settings',
  'settings.accessibilitySettings.long': 'Accessibility settings',
  'settings.all.long': 'Settings',
  'settings.amount': `{count, plural,
    one {# chosen}
    other {# chosen}
  }`,
  'settings.accessibility': 'My accessibility settings',
  'settings.sense.title': 'Hearing and sight',
  'settings.sense.hearing': 'I use a hearing aid',
  'settings.sense.visual': 'I\'m visually impaired',
  'settings.sense.colorblind': 'I have trouble distinguishing colours',
  'settings.info.title': 'Your selected settings will effect search results', // TODO: verify
  'settings.mobility.title': 'Mobility',
  'settings.mobility.none': 'No mobility impairments',
  'settings.mobility.wheelchair': 'I use a wheelchair',
  'settings.mobility.reduced_mobility': 'I have reduced mobility',
  'settings.mobility.rollator': 'I use a rollator',
  'settings.mobility.stroller': 'I push a stroller',
  'settings.city.info': `{count, plural,
    one {Chosen city}
    other {Chosen cities}
  }`,
  'settings.city.title': 'City',
  'settings.city.helsinki': 'Helsinki',
  'settings.city.espoo': 'Espoo',
  'settings.city.vantaa': 'Vantaa',
  'settings.city.kauniainen': 'Kauniainen',
  'settings.map.title': 'Background map',
  'settings.map.servicemap': 'Service map',
  'settings.map.ortoImage': 'Aerial view',
  'settings.map.guideMap': 'Guide map',
  'settings.aria.changed': 'Settings have changed. Remember to save',
  'settings.aria.closed': 'Settings closed',
  'settings.aria.open': 'Open settings',
  'settings.aria.opened': 'Settings opened',
  'settings.aria.saved': 'Settings have been saved',
};
