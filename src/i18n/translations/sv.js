/* eslint-disable quote-props */
export default {
  'app.title': 'Servicekarta',
  'address': 'Adress',

  // Accessibility
  'accessibility': 'Tillgänglighet',
  'accessibility.info': 'Tillgänglighetsuppgifter', // TODO: Verify
  'accessibility.details': 'Noggrannare uppgifter',
  'accessibility.stamp': 'Tillgängligheten beaktad',
  'accessibility.shortcomings': 'Brister',
  'accessibility.shortcomings.plural': `{count, plural,
                                =0 {inga brister}
                                one {# brist}
                                other {# brister}
                              }`,

  // Address
  'address.show.area': 'Visa området på kartan',
  'address.list.geographical': 'Geografisk',
  'address.list.protection': 'Befolkningsskydd',
  'address.list.health': 'Hälsa',
  'address.list.education': 'Utbildning',
  'address.list.neighborhood': 'Stadsdel',
  'address.list.postcode_area': 'Postnummerområde',
  'address.list.rescue_area': 'Skyddsdistrikt',
  'address.list.rescue_district': 'Skyddsavsnitt',
  'address.list.rescue_sub_district': 'Skyddsunderavsnitt',
  'address.list.health_station_district': 'Hälsostationsområde',
  'address.list.maternity_clinic_district': 'Rådgivningsområde',
  'address.list.lower_comprehensive_school_district_fi': 'Finskt grundskoleområde, lågklasserna',
  'address.list.lower_comprehensive_school_district_sv': 'Svenskt grundskoleområde, lågklasserna',
  'address.list.upper_comprehensive_school_district_fi': 'Finskt grundskoleområde, högklasserna',
  'address.list.upper_comprehensive_school_district_sv': 'Svenskt grundskoleområde, högklasserna',
  'address.list.preschool_education_fi': 'Finskt småbarnspedagogikområde',
  'address.list.preschool_education_sv': 'Svenskt småbarnspedagogikområde',
  'address.error': 'Addressen kunde inte hittas',
  'address.nearby': 'Nära',
  'address.districts': 'Områden',
  'address.plural': 'Adresser',

  // Event
  'event.description': 'Beskrivning',
  'event.time': 'Tidpunkt',
  'event.picture': 'Bild på evenemanget',
  'event.title': 'Evenemang',

  // Feedback
  'feedback.back': 'Gå tillbaka',
  'feedback.title': 'Ge respons om den här nättjänsten',
  'feedback.title.unit': 'Ge respons om verksamhetsstället {unit}',
  'feedback.email': 'Email',
  'feedback.email.info': 'Om du vill att vi svarar på din respons, vänligen uppge din e-postadress.',
  'feedback.feedback': 'Din respons (obligatorisk)',
  'feedback.feedback.info': 'Berätta så detaljerat som möjligt hurdan respons du vill ge.',
  'feedback.permission': 'Min respons får publiceras (efter kontroll). E-postadressen publiceras inte.',
  'feedback.additionalInfo': 'Din respons skickas vidare till Helsingfors stads responssystem.',
  'feedback.additionalInfo.link': 'Information och anvisningar om att ge respons (länken öppnas i en ny flik).',
  'feedback.send': 'Skicka respons',
  'feedback.error.required': 'Obligatoriskt fält',
  'feedback.modal.confirm': 'OK',
  'feedback.modal.leave': 'Är du säker på att du vill lämna den här sidan?',
  'feedback.modal.success': 'Tack för din respons!',
  'feedback.modal.error': 'Det gick inte att skicka.  Försök på nytt senare',

  // Sorting
  'sorting.label': 'Ordna sökresultaten',
  'sorting.accessibility.desc': 'Tillgängligaste först',
  'sorting.alphabetical.asc': 'Omvänd alfabetisk ordning',
  'sorting.alphabetical.desc': 'Alfabetisk ordning',
  'sorting.distance.asc': 'Närmast först',
  'sorting.match.desc': 'Bästa träffarna först',

  // General
  'general.frontPage': 'Första sidan',
  'general.contrast': 'Kontrast',
  'general.menu': 'Meny',
  'general.back': 'Tillbaka',
  'general.back.address': 'Gå tillbaka till adressvyn',
  'general.back.home': 'Gå tillbaka till startvyn',
  'general.back.goToHome': 'Gå till startvyn',
  'general.back.search': 'Gå tillbaka till sökvyn',
  'general.back.service': 'Gå tillbaka till tjänstevyn',
  'general.back.unit': 'Gå tillbaka till vyn för verksamhetsställen',
  'general.back.event': 'Gå tillbaka till evenemangsvyn',
  'general.back.feedback': 'Gå tillbaka',
  'general.backTo': 'Gå tillbaka',
  'general.back.info': 'Gå tillbaka',
  'general.backToHome': 'Stäng sökningen och gå tillbaka till början',
  'general.backToStart': 'Gå tillbaka till början av sidan',
  'general.back.serviceTree': 'Gå tillbaka', // TODO: Translate
  'general.cancel': 'Ångra',
  'general.close': 'Stäng',
  'general.yes': 'Ja',
  'general.no': 'Nej',
  'general.closeSettings': 'Stäng inställningarna',
  'general.fetching': 'Laddar data...',
  'general.home': 'Hem',
  'general.noData': 'Data finns inte',
  'general.loading': 'Laddar',
  'general.showOnMap': 'Visa på kartan',
  'general.pageTitles.home': 'Hemvy',
  'general.pageTitles.search': 'Sökresultatsvy',
  'general.pageTitles.unit': 'Vy med verksamhetsställen',
  'general.pageTitles.service': 'Tjänstevy',
  'general.pageTitles.serviceTree': 'Förteckning över tjänster',
  'general.pageTitles.event': 'Evenemangsvy',
  'general.pageTitles.address': 'Adressvy',
  'general.pageTitles.list.events': 'Förteckning över evenemang ',
  'general.pageTitles.list.reservations': 'Förteckning över reserveringar ',
  'general.pageTitles.info': 'Infovy',
  'general.pageTitles.feedback': 'Palautenäkymä', // TODO: Translate

  // General - Pagination
  'general.pagination.previous': 'Föregående sida',
  'general.pagination.next': 'Följande sida',
  'general.pagination.openPage': 'Öppna sida {count}',
  'general.pagination.currentlyOpenedPage': 'Sida {count} öppnad',
  'general.pagination.pageCount': 'sida {current} / {max}',

  'general.previousSearch': 'Föregående sökningar',
  'general.return.viewTitle': 'Gå till början av huvudinnehållet',
  'general.skipToContent': 'Gå till huvudinnehållet',
  'general.new.tab': 'Öppnas i en ny flik',
  'general.time.short': 'kl.',
  'general.save': 'Spara',
  'general.save.changes': 'Spara inställningar',
  'general.save.changes.done': 'Ändringarna har sparats!',
  'general.save.confirmation': 'Vill du spara ändringarna?',
  'general.search': 'Sök',
  'general.distance.meters': 'Meters avstånd',
  'general.distance.kilometers': 'Kilometers avstånd',

  // Home
  'home.buttons.settings': 'Spara dina egna stads- och tillgänglighetsinställningar',
  'home.buttons.services': 'Bekanta dig med tjänster med hjälp av förteckningen över tjänster',
  'home.buttons.closeByServices': 'Närtjänster', // TODO: Translate again
  'home.buttons.instructions': 'Tips för användning av servicekartan',
  'home.example.search': 'Sök med sökord',
  'home.message': 'Hälsningar av servicekartans utvecklare',
  'home.send.feedback': 'Skicka respons',

  // Location
  'location.notFound': 'Positionen hittades inte',
  'location.notAllowed': 'Positionen tilläts inte',

  // Map
  'map': 'Karta',
  'map.ariaLabel': 'Kartvy. Kartans uppgifter kan i nuläget granskas endast visuellt.',
  'map.transit.endStation': 'Ändhållplats',
  'map.address.searching': 'Söker adress...',
  'map.address.info': 'Adressens uppgifter',

  // Units
  'unit': 'Verksamhetsställe',
  'unit.accessibility.noInfo': 'Inga tillgänglighetsuppgifter',
  'unit.accessibility.noShortcomings': 'Inga igenkända brister',
  'unit.accessibility.ok': 'Tillänglig',
  'unit.accessibility.problems': `{count, plural,
                                    =0 {Tillänglig}
                                    one {# tillgänglighetsbrist}
                                    other {# tillgänglighetsbrister}
                                  }`,
  'unit.accessibility.unitNoInfo': 'Verksamhetsstället har inte meddelat tillgänglighetsuppgifter.',
  'unit.basicInfo': 'Grunduppgifter',
  'unit.data_source': 'Källa: {data_source}',
  'unit.details.notFound': 'Verksamhetsställets uppgifter finns inte att tillgå.',
  'unit.plural': 'Verksamhetsställen',

  'unit.contact.info': 'Kontaktuppgifter',
  'unit.eServices': 'E-tjänster',
  'unit.reservations': 'Objekt som kan reserveras',
  'unit.events': 'Evenemang',
  'unit.events.count': `{count, plural,
    =0 {}
    one {# evenemang}
    other {# evenemang}
  }`,
  'unit.events.more': 'Visa fler evenemang',
  'unit.homepage': 'Hemsida',
  'unit.homepage.missing': 'Ingen hemsida har meddelats',
  'unit.picture': 'Bild av verksamhetsstället',
  'unit.description': 'Information om verksamhetsstället',
  'unit.address': 'Adress',
  'unit.address.missing': 'Ingen adress har meddelats',
  'unit.phone': 'Telefonnummer',
  'unit.phone.missing': 'Telefonnummer har inte meddelats',
  'unit.email': 'E-postadress',
  'unit.email.missing': 'E-postadress har inte meddelats',
  'unit.opening.hours': 'Öppettider',
  'unit.opening.hours.missing': 'Öppettider har inte meddelats',
  'unit.opening.hours.info': 'Mer om öppettiderna',
  'unit.contact': 'Kontaktperson',
  'unit.school.year': 'Läsåret',
  'unit.opens.new.tab': '(ny flik)',
  'unit.reservations.count': `{count, plural,
    =0 {}
    one {# objekt som kan reserveras}
    other {# objekt som kan reserveras}
  }`,
  'unit.reservations.more': 'Visa fler objekt som kan reserveras',
  'unit.call.number': '(ring)',
  'unit.list.services': 'Tjänster',
  'unit.list.events': 'Evenemang',
  'unit.list.reservations': 'Objekt som kan reserveras',
  'unit.services': 'Tjänster',
  'unit.services.more': 'Visa fler tjänster',
  'unit.services.count': `{count, plural,
    =0 {}
    one {# tjänst}
    other {# tjänster}
  }`,
  'unit.route': 'Se vägen till det här stället',
  'unit.route.extra': '(Ny flik. Reseplaneraren är inte en tillgänglig tjänst)',
  'unit.socialMedia.title': 'Verksamhetsstället på sociala medier',

  // Search
  'search': 'Sök',
  'search.arrowLabel': 'Precisera',
  'search.cancelText': 'Töm sökfältet',
  'search.notFoundWith': 'Inga träffar för sökningen "{query}".',
  'search.placeholder': 'Sök tjänst eller verksamhetsställe',
  'search.info': `{count, plural,
                  =0 {Inga verksamhetsställen hittades}
                  one {# verksamhetsställe hittades}
                  other {# verksamhetsställen hittades}
                }`,
  'search.resultList': `{count, plural,
                  =0 {inga träffar}
                  one {# träff}
                  other {# träffar}
                }`,
  'search.results': `{count, plural,
                  =0 {Inga sökresultat hittades med sökningen}
                  one {# sökresultat hittades}
                  other {# sökresultat hittades}
                }`,
  'search.results.short': `{count, plural,
                  =0 {inga träffar}
                  one {# träff}
                  other {# träffar}
                }`,
  'search.results.units': `{count, plural,
                  =0 {inga verksamhetsställen hittades}
                  one {# verksamhetsställe hittades}
                  other {# verksamhetsställen hittades}
                }`,
  'search.results.services': `{count, plural,
                  =0 {inga tjänster hittades}
                  one {# tjänst hittades}
                  other {# tjänster hittades}
                }`,
  'search.resultInfo': 'Sökdata',
  'search.searchField': 'Sökfält',
  'search.results.title': 'Sökresultat',
  'search.input.placeholder': 'Sök verksamhetsställen',
  'search.loading.units': 'Söker verksamhetsställen {count} / {max}',
  'search.loading.units.srInfo': 'Söker {count} verksamhetsställe(n)',
  'search.notFound': 'Inga sökresultat hittades med sökningen',
  'search.started': 'Sökningen har börjat',
  'search.infoText': '{count} sökresultat',
  'search.searchbar.headerText': 'Alla tjänster i huvudstadsregionen inom ditt räckhåll.',
  'search.searchbar.infoText': 'Sök tjänster, verksamhetsställen eller adresser',
  'search.suggestions.suggest': 'Menade du..?',
  'search.suggestions.expand': 'Sökförslag',
  'search.suggestions.loading': 'Laddar förslag',
  'search.suggestions.error': 'Inga förslag',
  'search.suggestions.suggestions': '{count} sökförslag',
  // 'search.suggestions.expandSuggestions': '{count} preciseringsförslag',
  'search.suggestions.results': '{count} resultat',
  'search.suggestions.history': '{count} objekt i sökhistorien',
  'search.suggestions.noHistory': 'Inga tidigare sökningar',
  'search.tryAgain': 'Försök att söka på nytt',
  'search.tryAgainBody.spelling': 'kontrollera stavningen',
  'search.tryAgainBody.city': 'kontrollera stadsvalen',
  'search.tryAgainBody.service': 'skriv tjänstens namn',
  'search.tryAgainBody.address': 'skriv adressen i närheten av vilken du söker en tjänst',
  'search.tryAgainBody.keyword': 'skriv nyckelord, t.ex. naturstig, svenskt daghem',
  'search.expand': 'Precisera sökningen',
  'search.closeExpand': 'Gå tillbaka till sökningen',

  // Service
  'service': 'Tjänst',
  'service.plural': 'Tjänster',
  'service.nearby': 'Närtjänster',
  'service.units.empty': 'Tjänsten har inga verksamhetsställen',
  'service.tab': 'Tjänster och evenemang',

  // Service tree
  'services': 'Förteckning över tjänster',
  'services.selections': `{count, plural,
        one {Du har gjort (#) val}
        other {Du har gjort (#) val}
      }`,
  'services.selections.delete': 'Ta bort val:',
  'services.selections.delete.all': 'Ta bort alla val',
  'services.selections.delete.sr': 'Ta bort val: {service}',
  'services.search': 'Gör sökning',
  'services.search.sr': 'Sök med de valda tjänsterna',
  'services.search.sr.selected': 'Sök med tjänsterna: {services}',
  'services.category.select': 'Alla',
  'services.category.open': 'Öppna kategori',
  'services.tree.level': 'Nivå',

  // Settings
  'settings': 'Inställningar',
  'settings.citySettings': 'Stad',
  'settings.citySettings.long': 'Stadsinställningar',
  'settings.mapSettings': 'Kartbotten',
  'settings.mapSettings.long': 'Kartinställningar',
  'settings.accessibilitySettings': 'Tillgänglighetsinställningar',
  'settings.accessibilitySettings.long': 'Tillgänglighetsinställningar',
  'settings.all.long': 'Inställningar',
  'settings.amount': `{count, plural,
    one {# val} 
    other {# val}
  }`,
  'settings.accessibility': 'Tillgänglighetsuppgifter som gäller mig',
  'settings.sense.title': 'Hörsel och syn',
  'settings.sense.hearing': 'Jag använder hörapparat',
  'settings.sense.visual': 'Jag är synskadad',
  'settings.sense.colorblind': 'Jag är färgblind',
  'settings.info.heading': 'Inställningsuppgifter',
  'settings.info.title': 'Dina valda inställningar påverkar sökresultatet',
  'settings.info.title.noSettings': 'Ändra sök- eller tillgänglighetsinställningar',
  'settings.mobility.title': 'Rörelsebegränsningar',
  'settings.mobility.none': 'Inga rörelsebegränsningar',
  'settings.mobility.wheelchair': 'Jag använder rullstol',
  'settings.mobility.reduced_mobility': 'Jag är rörelsehindrad',
  'settings.mobility.rollator': 'Jag använder rollator',
  'settings.mobility.stroller': 'Jag går med barnvagn',
  'settings.city.info': `{count, plural,
    one {Staden jag valt} 
    other {Städerna jag valt}
  }`,
  'settings.city.title': 'Stad',
  'settings.city.helsinki': 'Helsingfors',
  'settings.city.espoo': 'Esbo',
  'settings.city.vantaa': 'Vanda',
  'settings.city.kauniainen': 'Grankulla',
  'settings.map.title': 'Kartbotten',
  'settings.map.servicemap': 'Servicekarta',
  'settings.map.ortographic': 'Flygbild',
  'settings.map.guideMap': 'Guidekarta',
  'settings.map.accessible_map': 'Karta med stor kontrast', // TODO: Verify
  'settings.aria.changed': 'Inställningarna har ändrats. Kom ihåg att spara.',
  'settings.aria.closed': 'Inställningarna har stängts',
  'settings.aria.open': 'Öppna inställningarna',
  'settings.aria.opened': 'Inställningarna har öppnats',
  'settings.aria.saved': 'Inställningarna har sparats',

  'info.title': 'Om tjänsten',
  'info.statement': 'Tillgänglighetsredogörelsen',
};
