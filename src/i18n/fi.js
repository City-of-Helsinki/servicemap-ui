/* eslint-disable quote-props */
export default {
  'app.title': 'Palvelukartta',

  // Accessibility
  'accessibility': 'Esteettömyys',
  'accessibility.info': 'Esteettömyystiedot',
  'accessibility.details': 'Tarkemmat tiedot',
  'accessibility.stamp': 'Esteettömyys huomioitu',
  'accessibility.shortcomings': 'Puutteet',
  'accessibility.shortcomings.plural': `{count, plural,
                                =0 {Ei puutteita}
                                one {# puute}
                                other {# puutetta}
                              }`,

  // Address
  'address': 'Osoite',
  'address.search': 'Osoitehaku',
  'address.search.location': 'Valittu sijainti on {location}',
  'address.show.area': 'Näytä alue kartalla',
  'address.error': 'Osoitetta ei löytynyt',
  'address.nearby': 'Lähellä',
  'address.districts': 'Alueet',
  'address.plural': 'Osoitteet',
  'address.services.header': 'Palvelut täällä asuville',
  'address.services.info': 'Kunnalliset palvelut, joiden piiriin sijainti kuuluu',
  'address.area.link': 'Tutustu alueisiin kartalla.',
  'address.emergency_care.common': 'Terveysaseman ollessa kiinni sekä öisin klo 22- 8 alle 16-vuotiaiden päivystys on <a>Lastenklinikalla</a> [<a1>kotisivut</a1>] ja aikuisten päivystys',
  'address.emergency_care.children_hospital.link': '/{locale}/unit/7299',
  'address.emergency_care.common.link': 'http://www.hus.fi/sairaanhoito/sairaalat/lastenklinikka/Sivut/default.aspx',
  'address.emergency_care.unit.26107': 'Malmin sairaalassa',
  'address.emergency_care.unit.26104': 'Haartmanin sairaalassa',
  'address.emergency_care.link': 'http://www.hel.fi/www/Helsinki/fi/sosiaali-ja-terveyspalvelut/terveyspalvelut/paivystys/',
  'address.emergency_care.link.text': '[<a>päivystyssivut</a>]',

  // Area
  'area.searchbar.infoText.address': 'Kirjoita kotiosoitteesi',
  'area.searchbar.infoText.optional': '(valinnainen)',
  'area.tab.selection': 'Alueen valinta',
  'area.tab.services': 'Alueen palvelut',
  'area.services.local': 'Oman alueesi palvelut',
  'area.services.nearby': 'Lähialueiden palvelut',
  'area.info': 'Valitse alue, jonka palveluista haluat tietoa. Kirjoittamalla alla olevaan hakukenttään kotiosoitteesi saat näkyville karttaan ja Alueen palvelut -välilehdelle alueet ja piirit, joihin kuulut',
  'area.choose.district': 'Valitse alue',
  'area.noSelection': 'Valitse alue Alueen Valinta -välilehdeltä',
  'area.list.geographical': 'Maantieteellinen',
  'area.list.protection': 'Väestönsuojelu',
  'area.list.health': 'Terveys',
  'area.list.education': 'Koulutus',
  'area.list.education.finnish': 'Suomenkieliset koulualueet',
  'area.list.education.swedish': 'Ruotsinkieliset koulualueet',
  'area.list.preschool': 'Esiopetus',
  'area.list.neighborhood': 'Kaupunginosa',
  'area.list.postcode_area': 'Postinumeroalue',
  'area.list.rescue_area': 'Suojelupiiri',
  'area.list.rescue_district': 'Suojelulohko',
  'area.list.rescue_sub_district': 'Suojelualalohko',
  'area.list.health_station_district': 'Terveysasema-alue',
  'area.list.maternity_clinic_district': 'Neuvola-alue',
  'area.list.lower_comprehensive_school_district_fi': 'Suomenkielinen ala-astealue',
  'area.list.lower_comprehensive_school_district_sv': 'Ruotsinkielinen ala-astealue',
  'area.list.upper_comprehensive_school_district_fi': 'Suomenkielinen yläastealue',
  'area.list.upper_comprehensive_school_district_sv': 'Ruotsinkielinen yläastealue',
  'area.list.preschool_education_fi': 'Suomenkielinen esiopetusalue',
  'area.list.preschool_education_sv': 'Ruotsinkielinen esiopetusalue',

  // Event
  'event.description': 'Kuvaus',
  'event.time': 'Ajankohta',
  'event.picture': 'Tapahtuman kuva',
  'event.title': 'Tapahtumat',

  // Embed
  'embed.click_prompt_move': 'Klikkaa siirtyäksesi Palvelukartalle',

  // Feedback
  'feedback.back': 'Palaa takaisin',
  'feedback.title': 'Anna palautetta tästä verkkopalvelusta',
  'feedback.title.unit': 'Anna palautetta toimipisteelle {unit}',
  'feedback.email': 'Sähköpostiosoite',
  'feedback.email.info': 'Jos haluat, että vastaamme antamaasi palautteeseen, anna sähköpostiosoitteesi.',
  'feedback.feedback': 'Palautteesi (pakollinen)',
  'feedback.feedback.info': 'Kerro mahdollisimman yksityiskohtaisesti mitä palautetta haluat antaa.',
  'feedback.permission': 'Palautteeni saa julkaista (tarkastuksen jälkeen). Sähköpostiosoitetta ei julkaista.',
  'feedback.additionalInfo': 'Antamasi palaute ohjautuu Helsingin kaupungin palautejärjestelmään.',
  'feedback.additionalInfo.link': 'Tietoja ja ohjeita palautteen antamisesta (linkki avautuu uuteen välilehteen).',
  'feedback.send': 'Lähetä palaute',
  'feedback.sending': 'Lähetetään...',
  'feedback.send.error': 'Lähetä palaute. Pakollinen kenttä täyttämättä',
  'feedback.error.required': 'Pakollinen kenttä',
  'feedback.srError.required': 'Palaute ei saa olla tyhjä',
  'feedback.modal.confirm': 'OK',
  'feedback.modal.leave': 'Haluatko varmasti poistua tältä sivulta?',
  'feedback.modal.success': 'Kiitos palautteestasi!',
  'feedback.modal.error': 'Lähetys epäonnistui. Yritä uudestaan myöhemmin',

  // Sorting
  'sorting.label': 'Järjestä hakutulokset:',
  'sorting.accessibility.desc': 'Esteettömin ensin',
  'sorting.alphabetical.asc': 'Käänteinen aakkosjärjestys',
  'sorting.alphabetical.desc': 'Aakkosjärjestys',
  'sorting.distance.asc': 'Lähin ensin',
  'sorting.match.desc': 'Osuvin ensin',

  // General
  'general.frontPage': 'Etusivu',
  'general.contrast': 'Kontrasti',
  'general.menu': 'Valikko',
  'general.menu.open': 'Avaa valikko',
  'general.menu.close': 'Sulje valikko',
  'general.back': 'Palaa',
  'general.back.address': 'Palaa osoitenäkymään',
  'general.back.area': 'Palaa aluenäkymään',
  'general.back.home': 'Palaa aloitusnäkymään',
  'general.back.goToHome': 'Siirry aloitusnäkymään',
  'general.back.search': 'Palaa hakunäkymään',
  'general.back.service': 'Palaa palvelunäkymään',
  'general.back.unit': 'Palaa toimipistenäkymään',
  'general.back.event': 'Palaa tapahtumanäkymään',
  'general.back.info': 'Palaa takaisin',
  'general.back.feedback': 'Palaa takaisin',
  'general.backTo': 'Palaa takaisin',
  'general.backToHome': 'Sulje haku ja palaa alkuun',
  'general.backToStart': 'Palaa sivun alkuun',
  'general.back.serviceTree': 'Palaa palvelulistausnäkymään',
  'general.cancel': 'Peruuta',
  'general.close': 'Sulje',
  'general.yes': 'Kyllä',
  'general.no': 'Ei',
  'general.closeSettings': 'Sulje asetukset',
  'general.fetching': 'Ladataan tietoja...',
  'general.home': 'Koti',
  'general.noData': 'Tietoa ei saatavilla',
  'general.loading': 'Ladataan',
  'general.loading.done': 'Lataus valmis',
  'general.showOnMap': 'Näytä kartalla',
  'general.pageTitles.home': 'Aloitusnäkymä',
  'general.pageTitles.search': 'Hakutulosnäkymä',
  'general.pageTitles.unit': 'Toimipistenäkymä',
  'general.pageTitles.unit.events': 'Toimipisteen tapahtumat',
  'general.pageTitles.unit.reservations': 'Toimipisteen varattavat kohteet',
  'general.pageTitles.service': 'Palvelunäkymä',
  'general.pageTitles.serviceTree': 'Palveluluettelo',
  'general.pageTitles.event': 'Tapahtumanäkymä',
  'general.pageTitles.address': 'Osoitenäkymä',
  'general.pageTitles.list.events': 'Tapahtumalista ',
  'general.pageTitles.list.reservations': 'Varauslista',
  'general.pageTitles.info': 'Tietoa palvelusta',
  'general.pageTitles.feedback': 'Palautenäkymä',
  'general.pageTitles.area': 'Aluenäkymä.',
  // Readspeaker
  'general.readspeaker.buttonText': 'Kuuntele',
  'general.readspeaker.title': 'Kuuntele ReadSpeaker webReaderilla',

  // General - Pagination
  'general.pagination.previous': 'Aiempi sivu',
  'general.pagination.next': 'Seuraava sivu',
  'general.pagination.openPage': 'Avaa sivu {count}',
  'general.pagination.currentlyOpenedPage': 'Sivu {count}, avattu',
  'general.pagination.pageCount': 'sivu {current} / {max}',

  'general.previousSearch': 'Aikaisemmat haut',
  'general.return.viewTitle': 'Siirry pääsisällön alkuun',
  'general.skipToContent': 'Siirry pääsisältöön',
  'general.new.tab': 'Aukeaa uuteen välilehteen',
  'general.time.short': 'klo',
  'general.save': 'Tallenna',
  'general.save.changes': 'Tallenna asetukset',
  'general.save.changes.done': 'Muutokset tallennettu!',
  'general.save.confirmation': 'Haluatko tallentaa muutokset?',
  'general.search': 'Hae',
  'general.distance.meters': 'Metrin päässä',
  'general.distance.kilometers': 'Kilometrin päässä',

  // Home
  'home.buttons.settings': 'Tallenna omat kaupunki- ja esteettömyysasetuksesi',
  'home.buttons.services': 'Tutustu palveluihin palveluluettelon avulla',
  'home.buttons.closeByServices': 'Näytä lähellä olevat palvelut',
  'home.buttons.instructions': 'Vinkkejä Palvelukartan käyttöön',
  'home.buttons.area': 'Katso alueet, kaupunginosat ja väestönsuojelupiirit',
  'home.example.search': 'Hae hakusanalla',
  'home.message': 'Terveisiä palvelukartan kehittäjiltä',
  'home.send.feedback': 'Anna palautetta',
  'home.old.link': 'Linkki vanhaan Palvelukarttaan',

  // Location
  'location.notFound': 'Sijaintia ei löytynyt',
  'location.notAllowed': 'Sijaintia ei sallittu',

  // Loading
  'loading.events': 'Haetaan tapahtumia {count} / {max}',
  'loading.events.srInfo': 'Haetaan {count} tapahtumaa',
  'search.loading.units': 'Haetaan toimipisteitä {count} / {max}',
  'search.loading.units.srInfo': 'Haetaan {count} toimipistettä',

  // Map
  'map': 'Kartta',
  'map.ariaLabel': 'Karttanäkymä. Kartan tietoja voi tarkastella tällä hetkellä vain näönvaraisesti.',
  'map.transit.endStation': 'Päätepysäkki',
  'map.address.searching': 'Haetaan osoitetta...',
  'map.address.info': 'Osoitteen tiedot',
  'map.unit.cluster.popup.info': '{count} toimipistettä',

  // Units
  'unit': 'Toimipiste',
  'unit.accessibility.hearingMaps': 'Kuuluvuuskartat',
  'unit.accessibility.hearingMaps.extra': '(Uusi välilehti. Palvelu ei ole saavutettava)',
  'unit.accessibility.noInfo': 'Ei esteettömyystietoja',
  'unit.accessibility.noShortcomings': 'Ei tiedossa olevia puutteita',
  'unit.accessibility.ok': 'Esteetön',
  'unit.accessibility.problems': `{count, plural,
                                    =0 {Esteetön}
                                    one {# esteettömyyspuute}
                                    other {# esteettömyyspuutetta}
                                  }`,
  'unit.accessibility.unitNoInfo': 'Toimipiste ei ole toimittanut esteettömyystietoja.',
  'unit.basicInfo': 'Perustiedot',
  'unit.data_source': 'Lähde: {data_source}',
  'unit.details.notFound': 'Toimipisteen tietoja ei saatavilla.',
  'unit.plural': 'Toimipisteet',

  'unit.contact.info': 'Yhteystiedot',
  'unit.links': 'Verkossa',
  'unit.eServices': 'Sähköinen asiointi',
  'unit.reservations': 'Varattavat kohteet',
  'unit.events': 'Toimipisteen tapahtumat',
  'unit.events.count': `{count, plural,
    =0 {}
    one {# tapahtuma}
    other {# tapahtumaa}
  }`,
  'unit.events.more': 'Näytä lisää tapahtumia',
  'unit.homepage': 'Kotisivu',
  'unit.homepage.missing': 'Kotisivua ei ilmoitettu',
  'unit.picture': 'Kuva toimipisteestä: ',
  'unit.description': 'Tietoa toimipisteestä',
  'unit.address': 'Osoite',
  'unit.address.missing': 'Osoitetta ei ilmoitettu',
  'unit.phone': 'Puhelinnumero',
  'unit.phone.missing': 'Puhelinnumeroa ei ilmoitettu',
  'unit.email': 'Sähköpostiosoite',
  'unit.email.missing': 'Sähköpostiosoitetta ei ilmoitettu',
  'unit.opening.hours': 'Aukioloajat',
  'unit.opening.hours.missing': 'Aukioloaikoja ei ilmoitettu',
  'unit.opening.hours.info': 'Lisätietoa aukioloajoista',
  'unit.contact': 'Yhteyshenkilö',
  'unit.school.year': 'Lukuvuosi',
  'unit.opens.new.tab': '(uusi välilehti)',
  'unit.reservations.count': `{count, plural,
    =0 {}
    one {# varattava kohde}
    other {# varattavaa kohdetta}
  }`,
  'unit.reservations.more': 'Näytä lisää varattavia kohteita',
  'unit.call.number': '(soita)',
  'unit.list.services': 'Palvelut',
  'unit.list.events': 'Tapahtumat',
  'unit.list.reservations': 'Varattavat kohteet',
  'unit.services': 'Palvelut toimipisteessä',
  'unit.services.more': 'Näytä lisää palveluja',
  'unit.services.count': `{count, plural,
    =0 {}
    one {# palvelu}
    other {# palvelua}
  }`,
  'unit.route': 'Katso reitti tänne',
  'unit.route.extra': '(Uusi välilehti. HSL-reittiopas ei ole saavutettava palvelu)',
  'unit.socialMedia.title': 'Toimipiste sosiaalisessa mediassa',

  // Search
  'search': 'Hae',
  'search.arrowLabel': 'Tarkenna',
  'search.cancelText': 'Tyhjennä hakukenttä',
  'search.notFoundWith': 'Ei osumia haulle "{query}".',
  'search.placeholder': 'Hae palvelua tai toimipistettä',
  'search.info': `{count, plural,
                  =0 {Toimipisteitä ei löytynyt}
                  one {# toimipiste löydetty}
                  other {# toimipistettä löydetty}
                }`,
  'search.resultList': `{count, plural,
                  =0 {ei osumia}
                  one {# osuma}
                  other {# osumaa}
                }`,
  'search.results': `{count, plural,
                  =0 {Haulla ei löytynyt hakutuloksia}
                  one {# hakutulos löydetty}
                  other {# hakutulosta löydetty}
                }`,
  'search.results.short': `{count, plural,
                  =0 {ei osumia}
                  one {# osuma}
                  other {# osumaa}
                }`,
  'search.results.units': `{count, plural,
                  =0 {ei toimipisteitä}
                  one {# toimipiste löydetty}
                  other {# toimipistettä löydetty}
                }`,
  'search.results.services': `{count, plural,
                =0 {palveluita ei löydetty}
                one {# palvelu löydetty}
                other {# palvelua löydetty}
              }`,
  'search.resultInfo': 'Hakutiedot',
  'search.searchField': 'Hakukenttä',
  'search.results.title': 'Hakutulokset',
  'search.input.placeholder': 'Hae toimipisteitä',
  'search.notFound': 'Haulla ei löytynyt hakutuloksia',
  'search.started': 'Haku aloitettu',
  'search.infoText': '{count} Hakutulosta',
  'search.searchbar.headerText': 'Pääkaupunkiseudun kaikki julkiset palvelut ulottuvillasi.',
  'search.searchbar.infoText': 'Hae palveluita, toimipisteitä tai osoitteita',
  'search.suggestions.suggest': 'Tarkoititko..?',
  'search.suggestions.expand': 'Hakuehdotukset',
  'search.suggestions.loading': 'Ladataan ehdotuksia',
  'search.suggestions.error': 'Ei ehdotuksia',
  'search.suggestions.suggestions': '{count} hakuehdotusta',
  // 'search.suggestions.expandSuggestions': '{count} tarkennusehdotusta',
  'search.suggestions.results': '{count} tulosta',
  'search.suggestions.history': '{count} kohdetta hakuhistoriassa',
  'search.suggestions.noHistory': 'Ei aikaisempia hakuja',
  'search.tryAgain': 'Yritä hakea uudelleen',
  'search.tryAgainBody.spelling': 'tarkista kirjoitusasu',
  'search.tryAgainBody.city': 'tarkista kaupunkivalinnat',
  'search.tryAgainBody.service': 'kirjoita palvelun nimi',
  'search.tryAgainBody.address': 'kirjoita osoite, jonka läheltä etsit palvelua',
  'search.tryAgainBody.keyword': 'kirjoita avainsanoja, esim. luontopolku, ruotsinkielinen päiväkoti',
  'search.expand': 'Hae tarkempia hakuehdotuksia',
  'search.closeExpand': 'Palaa hakuun',

  // Service
  'service': 'Palvelu',
  'service.plural': 'Palvelut',
  'service.nearby': 'Palvelut täällä asuville',
  'service.units.empty': 'Palvelulla ei ole toimipisteitä',
  'service.tab': 'Palvelut ja tapahtumat',

  // Service tree
  'services': 'Palveluluettelo',
  'services.selections': `{count, plural,
    one {Olet tehnyt (#) valinnan}
    other {Olet tehnyt (#) valintaa}
  }`,
  'services.selections.delete': 'Poista valinta',
  'services.selections.delete.all': 'Poista kaikki valinnat',
  'services.selections.delete.sr': 'Poista valinta: {service}',
  'services.search': 'Tee haku',
  'services.search.sr': 'Tee haku valituilla palveluilla',
  'services.search.sr.selected': 'Tee haku palveluilla: {services}',
  'services.category.select': 'Kaikki',
  'services.category.open': 'Avaa kategoria',
  'services.tree.level': 'Taso',

  // Settings
  'settings': 'Asetukset',
  'settings.citySettings': 'Kaupunki',
  'settings.citySettings.long': 'Kaupunkiasetukset',
  'settings.mapSettings': 'Karttapohja',
  'settings.mapSettings.long': 'Kartta-asetukset',
  'settings.accessibilitySettings': 'Esteettömyysasetukset',
  'settings.accessibilitySettings.long': 'Esteettömyysasetukset',
  'settings.mobile.long': 'Asetukset',
  'settings.search.long': 'Asetukset',
  'settings.amount': `{count, plural,
    one {# valinta}
    other {# valintaa}
  }`,
  'settings.accessibility': 'Minua koskevat esteettömyystiedot',
  'settings.sense.title': 'Aistirajoitteet',
  'settings.sense.hearing': 'Käytän kuulolaitetta',
  'settings.sense.visual': 'Olen näkövammainen',
  'settings.sense.colorblind': 'Minun on vaikea erottaa värejä',
  'settings.info.heading': 'Asetustiedot', // TODO: verify
  'settings.info.title': 'Valitsemasi asetukset vaikuttavat hakutulokseen',
  'settings.info.title.noSettings': 'Muuta haku- tai esteettömyysasetuksia',
  'settings.mobility.title': 'Liikkumisrajoitteet',
  'settings.mobility.none': 'Ei liikkumisrajoitteita',
  'settings.mobility.wheelchair': 'Käytän pyörätuolia',
  'settings.mobility.reduced_mobility': 'Olen liikkumisesteinen',
  'settings.mobility.rollator': 'Käytän rollaattoria',
  'settings.mobility.stroller': 'Työnnän rattaita',
  'settings.city.info': `{count, plural,
    one {Valitsemani kaupunki}
    other {Valitsemani kaupungit}
  }`,
  'settings.city.title': 'Kaupunki',
  'settings.city.helsinki': 'Helsinki',
  'settings.city.espoo': 'Espoo',
  'settings.city.vantaa': 'Vantaa',
  'settings.city.kauniainen': 'Kauniainen',
  'settings.map.title': 'Karttapohja',
  'settings.map.servicemap': 'Palvelukartta',
  'settings.map.ortographic': 'Ilmakuva',
  'settings.map.guideMap': 'Opaskartta',
  'settings.map.accessible_map': 'Korkeakontrastinen kartta',
  'settings.aria.changed': 'Asetukset muutettu. Muista tallentaa',
  'settings.aria.closed': 'Asetukset suljettu',
  'settings.aria.open': 'Avaa asetukset',
  'settings.aria.opened': 'Asetukset avattu',
  'settings.aria.saved': 'Asetukset on tallennettu',

  'info.title': 'Tietoa palvelusta',
  'info.statement': 'Saavutettavuusseloste',

  'alert.close': 'Sulje ilmoitus',
};
