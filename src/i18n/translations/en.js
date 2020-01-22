/* eslint-disable quote-props */
export default {
  'app.title': 'Service map',
  'address': 'Address',

  // Accessibility
  'accessibility': 'Accessibility',
  'accessibility.info': 'Accessibility details',
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
  'address.list.protection': 'Civil defence',
  'address.list.health': 'Health',
  'address.list.education': 'Education',
  'address.list.neighborhood': 'Neighborhood',
  'address.list.postcode_area': 'Postcode area',
  'address.list.rescue_area': 'Civil defence district',
  'address.list.rescue_district': 'Civil defence section',
  'address.list.rescue_sub_district': 'Civil defence subsection',
  'address.list.health_station_district': 'Health station area',
  'address.list.maternity_clinic_district': 'Maternity clinic area',
  'address.list.lower_comprehensive_school_district_fi': 'Finnish primary school',
  'address.list.lower_comprehensive_school_district_sv': 'Swedish primary school',
  'address.list.upper_comprehensive_school_district_fi': 'Finnish secondary school',
  'address.list.upper_comprehensive_school_district_sv': 'Swedish secondary school',
  'address.list.preschool_education_fi': 'Finnish preschool education',
  'address.list.preschool_education_sv': 'Swedish preschool education',
  'address.error': 'No address found',
  'address.nearby': 'Nearby',
  'address.districts': 'Areas',
  'address.plural': 'Addresses',

  // Event
  'event.description': 'Description',
  'event.time': 'Date and time',
  'event.picture': 'Event picture',
  'event.title': 'Events',

  // Sorting
  'sorting.label': 'Sort search results',
  'sorting.accessibility.desc': 'Most accessibile first',
  'sorting.alphabetical.asc': 'Reversed alphabetical order',
  'sorting.alphabetical.desc': 'Alphabetical order',
  'sorting.distance.asc': 'Closest first',
  'sorting.match.desc': 'Most relevant first',

  // General
  'general.frontPage': 'Front page',
  'general.contrast': 'Contrast',
  'general.menu': 'Menu',
  'general.back': 'Back',
  'general.back.address': 'Back to address view',
  'general.back.home': 'Back to home view',
  'general.back.goToHome': 'Go to home view',
  'general.back.search': 'Back to search view',
  'general.back.service': 'Back to service view',
  'general.back.unit': 'Back to unit view',
  'general.back.event': 'Back to event view',
  'general.backTo': 'Return back', // TODO: verify
  'general.backToHome': 'Close search and return to beginning',
  'general.backToStart': 'Back to beginning of page',
  'general.back.serviceTree': 'Back to service list page',
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
  'general.pageTitles.search': 'Search results view',
  'general.pageTitles.unit': 'Unit view',
  'general.pageTitles.service': 'Service view',
  'general.pageTitles.serviceTree': 'Services list',
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
  'home.buttons.settings': 'Save your own city and accessibility options',
  'home.buttons.services': 'Get to know the services using the Services list',
  'home.buttons.closeByServices': 'Show nearby services',
  'home.buttons.instructions': 'Tips for using the service map',
  'home.example.search': 'Search for',
  'home.message': 'Message from the developers',
  'home.send.feedback': 'Send feedback',

  // Location
  'location.notFound': 'Location not found',
  'location.notAllowed': 'Location not allowed',

  // Map
  'map': 'Map',
  'map.ariaLabel': 'Map. Currently map information is only accessible visually.',
  'map.transit.endStation': 'Terminus',
  'map.address.searching': 'Retreiving address...',
  'map.address.info': 'Address information',

  // Units
  'unit': 'Unit',
  'unit.accessibility.noInfo': 'No accessibility information',
  'unit.accessibility.noShortcomings': 'No known shortcomings',
  'unit.accessibility.ok': 'Accessible',
  'unit.accessibility.problems': `{count, plural,
                                    =0 {Accessible}
                                    one {# accessibility shortcoming}
                                    other {# accessibility shortcomings}
                                  }`,
  'unit.accessibility.unitNoInfo': 'Unit has not delivered any accessibility information.', // TODO: verify
  'unit.basicInfo': 'Information',
  'unit.data_source': 'Source: {data_source}',
  'unit.details.notFound': 'Unit info not available.',
  'unit.plural': 'Units',

  'unit.contact.info': 'Contact information',
  'unit.eServices': 'Electronic services',
  'unit.reservations': 'Reservable objects',
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
  'unit.reservations.count': `{count, plural,
    =0 {}
    one {# reservable object}
    other {# reservable objects}
  }`,
  'unit.reservations.more': 'Show more reservable objects',
  'unit.call.number': '(call)',
  'unit.list.services': 'Services',
  'unit.list.events': 'Events',
  'unit.list.reservations': 'Reservable objects',
  'unit.services': 'Services',
  'unit.services.more': 'Show more services',
  'unit.services.count': `{count, plural,
    =0 {}
    one {# service}
    other {# services}
  }`,

  // Search
  'search': 'Search',
  'search.arrowLabel': 'Refine',
  'search.cancelText': 'Clear search text',
  'search.notFoundWith': 'No results for search "{query}".',
  'search.placeholder': 'Search for services or units',
  'search.info': `{count, plural,
                  =0 {No units were found}
                  one {# unit found}
                  other {# units found}
                }`,
  'search.resultList': `{count, plural,
                  =0 {no matches}
                  one {# match}
                  other {# matches}
                }`,
  'search.results': `{count, plural,
                  =0 {No results found with given search}
                  one {# result found}
                  other {# results found}
                }`,
  'search.results.short': `{count, plural,
                  =0 {No matches}
                  one {# match}
                  other {# matches}
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
  'search.loading.units.srInfo': 'Searching {count} unit(s)',
  'search.notFound': 'No results found with given search',
  'search.started': 'Search started',
  'search.infoText': '{count} Search results',
  'search.searchbar.headerText': 'All the services in the metropolitan area within your reach.',
  'search.searchbar.infoText': 'Search for services units or addresses',
  'search.suggestions.suggest': 'Did you mean..?',
  'search.suggestions.expand': 'Search suggestions',
  'search.suggestions.loading': 'Loading suggestions',
  'search.suggestions.error': 'No suggestions',
  'search.suggestions.suggestions': '{count} search suggestions',
  // 'search.suggestions.expandSuggestions': '{count} refinement suggestions',
  'search.suggestions.results': '{count} results',
  'search.suggestions.history': '{count} items in search history',
  'search.suggestions.noHistory': 'No previous searches',
  'search.tryAgain': 'Try searching again',
  'search.tryAgainBody.spelling': 'check spelling',
  'search.tryAgainBody.city': 'check city choices',
  'search.tryAgainBody.service': 'write name of service',
  'search.tryAgainBody.address': 'write address close to service you are looking for',
  'search.tryAgainBody.keyword': 'write keywords, e.g. nature trail, Swedish day-care centre',
  'search.expand': 'Refine search',
  'search.closeExpand': 'Return to search',

  // Service
  'service': 'Service',
  'service.plural': 'Services',
  'service.nearby': 'Nearby services',
  'service.units.empty': 'Service does not have units',
  'service.tab': 'Services and events',

  // Service tree
  'services': 'Services list',
  'services.selections': `{count, plural,
      one {You have made (#) selection}
      other {You have made (#) selections}
    }`,
  'services.selections.delete': 'Remove',
  'services.selections.delete.all': 'Remove all selections',
  'services.selections.delete.sr': 'Remove selection {service}',
  'services.search': 'Perform search',
  'services.search.sr': 'Perform search with the selected services',
  'services.search.sr.selected': 'Perform search with services: {services}',

  // Settings
  'settings': 'Settings',
  'settings.citySettings': 'City',
  'settings.citySettings.long': 'City settings',
  'settings.mapSettings': 'Background map',
  'settings.mapSettings.long': 'Map setttings',
  'settings.accessibilitySettings': 'Accessibility settings',
  'settings.accessibilitySettings.long': 'Accessibility settings',
  'settings.all.long': 'Settings',
  'settings.amount': `{count, plural,
    one {# selection}
    other {# selections}
  }`,
  'settings.accessibility': 'My accessibility settings',
  'settings.sense.title': 'Hearing and sight',
  'settings.sense.hearing': 'I use a hearing aid',
  'settings.sense.visual': 'I am visually impaired',
  'settings.sense.colorblind': 'I have color vision deficiency',
  'settings.info.heading': 'Settings info', // TODO: verify
  'settings.info.title': 'Your selected settings will effect search results', // TODO: verify
  'settings.info.title.noSettings': 'Change search or accessibility settings', // TODO: verify
  'settings.mobility.title': 'Mobility impairments',
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
  'settings.map.orthoImage': 'Aerial view',
  'settings.map.guideMap': 'Guide map',
  'settings.map.accessible_map': 'High contrast map', // TODO: verify
  'settings.aria.changed': 'Settings have changed. Remember to save',
  'settings.aria.closed': 'Settings closed',
  'settings.aria.open': 'Open settings',
  'settings.aria.opened': 'Settings have been opened',
  'settings.aria.saved': 'Settings have been saved',
};
