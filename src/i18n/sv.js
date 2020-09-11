/* eslint-disable quote-props */
export default {
  'app.title': 'Servicekarta',

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
  'address': 'Adress',
  'address.search': 'Adresssök',
  'address.search.location': 'Den valda positionen är {location}',
  'address.show.area': 'Visa området på kartan',
  'address.error': 'Addressen kunde inte hittas',
  'address.nearby': 'Nära',
  'address.districts': 'Områden',
  'address.plural': 'Adresser',
  'address.services.header': 'Service för dem som bor här',
  'address.services.info': 'Kommunala tjänster vars verksamhetsområde omfattar positionen',
  'address.area.link': 'Bekanta dig med områdena på kartan.',
  'address.emergency_care.common': 'När den egna hälsostationen är stängd och på natten kl. 22-8 är jour för barn och unga under 16 år på <a>Barnkliniken</a> [<a1>hemsidor</a1>], och jour för vuxna på',
  'address.emergency_care.children_hospital.link': '/{locale}/unit/7299',
  'address.emergency_care.common.link': 'https://www.hus.fi/sv/sjukvard/sjukhus/nyabarnsjukhuset/Sidor/default.aspx',
  'address.emergency_care.unit.26107': 'Malms sjukhuset',
  'address.emergency_care.unit.26104': 'Haartmanska sjukhuset',
  'address.emergency_care.link': 'http://www.hel.fi/www/Helsinki/fi/sosiaali-ja-terveyspalvelut/terveyspalvelut/paivystys/',
  'address.emergency_care.link.text': '[<a>joursidor</a>]',

  // Area
  'area.searchbar.infoText.address': 'Skriv din hemadress',
  'area.searchbar.infoText.optional': '(valfri)',
  'area.tab.selection': 'Val av område',
  'area.tab.services': 'Tjänster i området',
  'area.services.local': 'Tjänster i ditt eget område',
  'area.services.nearby': 'Tjänster i närområdena',
  'area.info': 'Välj ett område, vars tjänster du vill ha information om. Genom att skriva din hemadress i sökfältet öppnas en karta och under fliken Tjänster i området visas de områden och distrikt som du hör till',
  'area.choose.district': 'Väl område',
  'area.noSelection': 'Väl område under fliken Val av område',
  'area.list.geographical': 'Geografisk',
  'area.list.protection': 'Befolkningsskydd',
  'area.list.health': 'Hälsa',
  'area.list.education': 'Utbildning',
  'area.list.education.finnish': 'Finska skolområden',
  'area.list.education.swedish': 'Svenska skolområden',
  'area.list.preschool': 'Förskoleundervisning',
  'area.list.neighborhood': 'Stadsdel',
  'area.list.postcode_area': 'Postnummerområde',
  'area.list.rescue_area': 'Skyddsdistrikt',
  'area.list.rescue_district': 'Skyddsavsnitt',
  'area.list.rescue_sub_district': 'Skyddsunderavsnitt',
  'area.list.health_station_district': 'Hälsostationsområde',
  'area.list.maternity_clinic_district': 'Rådgivningsområde',
  'area.list.lower_comprehensive_school_district_fi': 'Finskt grundskoleområde, lågklasserna',
  'area.list.lower_comprehensive_school_district_sv': 'Svenskt grundskoleområde, lågklasserna',
  'area.list.upper_comprehensive_school_district_fi': 'Finskt grundskoleområde, högklasserna',
  'area.list.upper_comprehensive_school_district_sv': 'Svenskt grundskoleområde, högklasserna',
  'area.list.preschool_education_fi': 'Finskt småbarnspedagogikområde',
  'area.list.preschool_education_sv': 'Svenskt småbarnspedagogikområde',

  // Event
  'event.description': 'Beskrivning',
  'event.time': 'Tidpunkt',
  'event.picture': 'Bild på evenemanget',
  'event.title': 'Evenemang',

  // Embed
  'embed.click_prompt_move': 'Klicka för att öppna Servicekartan',

  // Embedder
  'embedder.city.title': 'Staden',
  'embedder.city.aria.label': 'Välj stadsgränser för inbäddningen',
  'embedder.close': 'Stäng inbäddningsverktyget',
  'embedder.code.title': 'Kopiera HTML-koden',
  'embedder.height.title': 'Inbäddningens höjd',
  'embedder.height.aria.label': 'Välj inbäddningens höjd',
  'embedder.height.ratio.label': 'Relativ höjd. Inbäddningens höjd i förhållande till dess bredd har fastställts',
  'embedder.height.fixed.label': 'Abslout höjd. Inbäddningens höjd har fastställts i pixlar',
  'embedder.height.input.aria.fixed': 'Inbäddningens höjd i pixlar',
  'embedder.height.input.aria.ratio': 'Inbäddningens höjd som procent av bredden',
  'embedder.iframe.title': 'Servicekartans inbäddningsfönster',
  'embedder.language.title': 'Inbäddningens språk',
  'embedder.language.aria.label': 'Välj inbäddningens språk',
  'embedder.language.description.fi': 'Verksamhetsställenas information visas på finska. Bakgrundskartan är på finska.',
  'embedder.language.description.sv': 'Verksamhetsställenas information visas på svenska. Bakgrundskartan är på svenska.',
  'embedder.language.description.en': 'Verksamhetsställenas information visas på engelska. Bakgrundskartan är på finska.',
  'embedder.map.title': 'Bakgrundskarta',
  'embedder.map.aria.label': 'Välj bakgrundskarta',
  'embedder.options.title': 'Visa på kartan',
  'embedder.options.label.units': 'Visa verksamhetsställen',
  'embedder.options.label.transit': 'Visa kollektivtrafikens hållplatser (Zooma in kartan för att se hållplatserna)',
  'embedder.preview.title': 'Map preview',
  'embedder.service.title': 'Tjänster',
  'embedder.service.aria.label': 'Välj tjänsterna som visas',
  'embedder.service.none': 'Kartan visas utan verksamhetsställen',
  'embedder.service.common': 'På kartan visas de vanligaste verksamhetsställena i stadsbons vardag: skolor, daghem och hälsostationer.',
  'embedder.service.all': 'Alla verksamhetsställen visas på kartan. För omfattande områdesgränser gör inbäddningen långsammare och otydligare.',
  'embedder.title': 'Inbäddningsverktyg',
  'embedder.title.info': 'Om du vill göra en inbäddning enligt sökresultat, börja med att göra sökningen.',
  'embedder.url.title': 'Kopiera adressen',
  'embedder.width.title': 'Inbäddningens bredd',
  'embedder.width.aria.label': 'Välj inbäddningens bredd',
  'embedder.width.auto.label': 'Automatisk bredd. Inbäddningen fyller bredden av elementet som den har placerats i. I den här förhandsgranskningen har inbäddningen placeats i ett element med standardbredd markerat med en streckad linje.',
  'embedder.width.custom.label': 'Bredden har fastställts. Inbäddningens bredd har fastställs i pixlar.',
  'embedder.width.input.aria.auto': 'Inbäddningens bredd, procent',
  'embedder.width.input.aria.custom': 'Inbäddningens bredd, pixlar',

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
  'feedback.sending': 'Sänder...',
  'feedback.send.error': 'Skicka respons. Obligatoriska fält måste fyllas i',
  'feedback.error.required': 'Obligatoriskt fält',
  'feedback.srError.required': 'Respons måste fyllas i',
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
  'general.frontPage': 'Framsidan',
  'general.contrast': 'Kontrast',
  'general.menu': 'Meny',
  'general.menu.open': 'Öppna menyn',
  'general.menu.close': 'Stäng menyn',
  'general.back': 'Tillbaka',
  'general.back.address': 'Gå tillbaka till adressvyn',
  'general.back.area': 'Gå tillbaka till områdesvyn',
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
  'general.back.serviceTree': 'Gå tillbaka till servicekatalogen',
  'general.cancel': 'Ångra',
  'general.close': 'Stäng',
  'general.yes': 'Ja',
  'general.no': 'Nej',
  'general.closeSettings': 'Stäng inställningarna',
  'general.fetching': 'Laddar data...',
  'general.home': 'Hem',
  'general.noData': 'Data finns inte',
  'general.loading': 'Laddar',
  'general.loading.done': 'Laddning färdig',
  'general.showOnMap': 'Visa på kartan',
  'general.open': 'Open', // TODO: Translate
  'general.page.close': 'Close page', // TODO: Translate
  'general.pageTitles.home': 'Hemvy',
  'general.pageTitles.search': 'Sökresultatsvy',
  'general.pageTitles.unit': 'Vy med verksamhetsställen',
  'general.pageTitles.unit.events': 'Verksamhetsställets evenemang',
  'general.pageTitles.unit.reservations': 'Verksamhetsställets platser som kan reserveras',
  'general.pageTitles.service': 'Tjänstevy',
  'general.pageTitles.serviceTree': 'Servicekatalog',
  'general.pageTitles.event': 'Evenemangsvy',
  'general.pageTitles.address': 'Adressvy',
  'general.pageTitles.list.events': 'Förteckning över evenemang ',
  'general.pageTitles.list.reservations': 'Förteckning över reserveringar ',
  'general.pageTitles.info': 'Infovy',
  'general.pageTitles.feedback': 'Responsvy',
  'general.pageTitles.area': 'Områdesvy.',

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
  'general.save': 'Spara',
  'general.save.changes': 'Spara inställningar',
  'general.save.changes.done': 'Ändringarna har sparats!',
  'general.save.confirmation': 'Vill du spara ändringarna?',
  'general.search': 'Sök',
  'general.time.short': 'kl.',
  'general.tools': 'Verktyg',
  'general.distance.meters': 'Meters avstånd',
  'general.distance.kilometers': 'Kilometers avstånd',
  'general.tools': 'Verktyg',
  // Readspeaker
  'general.readspeaker.buttonText': 'Lyssna', // TODO: verify
  'general.readspeaker.title': 'Lyssna med ReadSpeaker webReader', // TODO: verify

  // Home
  'home.buttons.settings': 'Spara dina egna stads- och tillgänglighetsinställningar',
  'home.buttons.services': 'Läs mer om tjänsterna i servicekatalogen',
  'home.buttons.closeByServices': 'Visa närtjänster',
  'home.buttons.instructions': 'Tips för användning av servicekartan',
  'home.buttons.area': 'Se områden, stadsdelar och befolkningsskyddsdistrikt',
  'home.example.search': 'Sök med sökord',
  'home.message': 'Hälsningar av servicekartans utvecklare',
  'home.send.feedback': 'Skicka respons',
  'home.old.link': 'Gamla Servicekartan',

  // Location
  'location.notFound': 'Positionen hittades inte',
  'location.notAllowed': 'Positionen tilläts inte',

  // Loading
  'loading.events': 'Söker evenemang {count} / {max}',
  'loading.events.srInfo': 'Söker {count} evenemange(n)',
  'search.loading.units': 'Söker verksamhetsställen {count} / {max}',
  'search.loading.units.srInfo': 'Söker {count} verksamhetsställe(n)',

  // Map
  'map': 'Karta',
  'map.ariaLabel': 'Kartvy. Kartans uppgifter kan i nuläget granskas endast visuellt.',
  'map.transit.endStation': 'Ändhållplats',
  'map.address.searching': 'Söker adress...',
  'map.address.notFound': 'Adressen hittades ej',
  'map.address.info': 'Adressens uppgifter',
  'map.unit.cluster.popup.info': '{count} verksamhetsställen', // TODO: Verify

  // Units
  'unit': 'Verksamhetsställe',
  'unit.accessibility.hearingMaps': 'Täckningskartor',
  'unit.accessibility.hearingMaps.extra': '(Ny flik. Tjänsten är inte tillgänglig)',
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
  'unit.links': 'På webben',
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
  'unit.route.extra': '(Ny flik. HRT-reseplaneraren är inte en tillgänglig tjänst)',
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
  'search.notFound': 'Inga sökresultat hittades med sökningen',
  'search.started': 'Sökningen har börjat',
  'search.infoText': '{count} sökresultat',
  'search.searchbar.headerText': 'Alla tjänster i huvudstadsregionen inom räckhåll.',
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
  'settings.mapSettings': 'Kartunderlag',
  'settings.mapSettings.long': 'Kartinställningar',
  'settings.accessibilitySettings': 'Tillgänglighetsinställningar',
  'settings.accessibilitySettings.long': 'Tillgänglighetsinställningar',
  'settings.mobile.long': 'Inställningar',
  'settings.search.long': 'Inställningar',
  'settings.amount': `{count, plural,
    one {# val} 
    other {# val}
  }`,
  'settings.accessibility': 'Tillgänglighetsuppgifter som gäller mig',
  'settings.sense.title': 'Hörsel och syn',
  'settings.sense.hearing': 'Jag använder hörapparat',
  'settings.sense.visual': 'Jag är synskadad',
  'settings.sense.colorblind': 'Jag har svårt att urskilja förger',
  'settings.info.heading': 'Inställningsuppgifter',
  'settings.info.title': 'Dina valda inställningar påverkar sökresultatet',
  'settings.info.title.noSettings': 'Ändra sök- eller tillgänglighetsinställningar',
  'settings.mobility.title': 'Rörelsehinder',
  'settings.mobility.none': 'Inga rörelsehinder',
  'settings.mobility.wheelchair': 'Jag använder rullstol',
  'settings.mobility.reduced_mobility': 'Jag har rörelsehinder',
  'settings.mobility.rollator': 'Jag använder rollator',
  'settings.mobility.stroller': 'Jag går med barnvagn',
  'settings.city.info': `{count, plural,
    one {Vald stad} 
    other {Vald städer}
  }`,
  'settings.city.title': 'Stad',
  'settings.city.helsinki': 'Helsingfors',
  'settings.city.espoo': 'Esbo',
  'settings.city.vantaa': 'Vanda',
  'settings.city.kauniainen': 'Grankulla',
  'settings.map.title': 'Kartunderlag',
  'settings.map.servicemap': 'Servicekarta',
  'settings.map.ortographic': 'Flygbild',
  'settings.map.guideMap': 'Guidekarta',
  'settings.map.accessible_map': 'Karta med stor kontrast',
  'settings.aria.changed': 'Inställningarna har ändrats. Kom ihåg att spara.',
  'settings.aria.closed': 'Inställningarna har stängts',
  'settings.aria.open': 'Öppna inställningarna',
  'settings.aria.opened': 'Inställningarna har öppnats',
  'settings.aria.saved': 'Inställningarna har sparats',

  // Tools
  'tool.download': 'Exportera (ny flik)',
  'tool.measuring': 'Mät avstånd',
  'tool.measuring.stop': 'Sluta mäta',

  'info.title': 'Om tjänsten och tillgänglighetsredogörelsen',
  'info.statement': 'Tillgänglighetsredogörelsen',

  'alert.close': 'Stäng meddelande',
};
