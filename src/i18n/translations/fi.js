/* eslint-disable quote-props */
export default {
  'app.title': 'Palvelukartta',

  // General
  'general.back': 'Takaisin',

  // Map
  'map.transit.endStation': 'Päätepysäkki',

  // Units
  'unit.data_source': 'Lähde: {data_source}', // TODO: Translate
  'unit.details.notFound': 'Toimipisteen tietoja ei saatavilla.',
  'unit.plural': 'Toimipisteet',

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
};
