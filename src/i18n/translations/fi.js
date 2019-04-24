/* eslint-disable quote-props */
export default {
  'app.title': 'Palvelukartta',
  'address': 'Osoite',

  // Event
  'event.nearby': 'Lähellä olevat tapahtumat',

  // General
  'general.back': 'Takaisin',
  'general.home': 'Koti',
  'general.back.home': 'Takaisin etusivulle',
  'general.noData': 'Tietoa ei saatavilla',
  'general.loading': 'Ladataan',

  // Map
  'map': 'Kartta',
  'map.transit.endStation': 'Päätepysäkki',

  // Units
  'unit': 'Toimipiste',
  'unit.accessibility.noInfo': 'Ei esteettömyystietoja',
  'unit.accessibility.ok': 'Esteetön',
  'unit.accessibility.problems': `{count, plural,
                                    =0 {Esteetön}
                                    one {# esteettömyyspuute}
                                    other {# esteettömyyspuutetta}
                                  }`,
  'unit.data_source': 'Lähde: {data_source}', // TODO: Translate
  'unit.details.notFound': 'Toimipisteen tietoja ei saatavilla.',
  'unit.plural': 'Toimipisteet',

  'unit.contact.info': 'Yhteystiedot',
  'unit.services': 'Palvelut toimipisteessä',
  'unit.e.services': 'Sähköinen asiointi',
  'unit.homepage': 'Kotisivu',
  'unit.picture': 'Kuva toimipisteestä: ',
  'unit.description': 'Tietoa toimipisteestä',
  'unit.address': 'Osoite',
  'unit.phone': 'Puhelinnumero',
  'unit.opening.hours': 'Aukioloajat',
  'unit.opening.hours.info': 'Lisätietoa aukioloajoista',
  'unit.contact': 'Yhteyshenkilö',
  'unit.school.year': 'Lukuvuosi',
  'unit.opens.new.tab': '(uusi välilehti)',
  'unit.call.number': '(soita)',

  // Search
  'search': 'Hae',
  'search.info': `{count, plural,
                  =0 {Toimipisteitä ei löytynyt}
                  one {# toimipiste löydetty}
                  other {# toimipistettä löydetty}
                }`,
  'search.results': `{count, plural,
    =0 {ei osumia}
    one {# osuma}
    other {# osumaa}
  }`,
  'search.input.placeholder': 'Hae toimipisteitä',
  'search.loading.units': 'Haetaan toimipisteitä {count} / {max}',
  'search.loading.units.srInfo': 'Haetaan {count} toimipistettä',
  'search.started': 'Haku aloitettu',

  // Service
  'service': 'Palvelu',
  'service.nearby': 'Lähellä olevat palvelut',
};
